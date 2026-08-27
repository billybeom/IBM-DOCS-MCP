#!/usr/bin/env node
/**
 * 제품 라우팅 평가.
 *
 * "질의가 주어졌을 때 올바른 제품을 고를 수 있는가" 를 측정한다.
 * Phase 2 (툴 3개 + product 파라미터) 가 현재 방식보다 나은지 판단하는 근거.
 *
 *   node scripts/eval-routing.mjs                 # 캐시된 라벨셋으로 평가
 *   node scripts/eval-routing.mjs --rebuild       # 라벨셋 재생성 후 평가
 *   node scripts/eval-routing.mjs --per-product 8 # 제품당 라벨 수 (기본 6)
 *
 * 라벨은 각 제품 TOC 의 실제 문서 제목에서 뽑는다. 검색 결과에서 뽑으면
 * 검색엔진 편향이 정답 라벨에 섞이므로 TOC 를 쓴다.
 *
 * 측정하는 것은 "서버가 모델에게 주는 신호의 품질" 이지 모델의 최종 선택이 아니다.
 * 최종 선택까지 재려면 LLM 을 루프에 넣어야 하는데, 그건 이 스크립트의 범위 밖이다.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { PRODUCTS } from "../core/dist/products.js";

const ROOT = resolve(import.meta.dirname, "..");
const LABELS = join(ROOT, "scripts", "routing-labels.json");
const API = "https://www.ibm.com/docs/api/v1";
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json",
};

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? Number(argv[i + 1]) : d; };
const PER_PRODUCT = opt("--per-product", 6);
const SHORTLIST = opt("--shortlist", 5);

const IDS = Object.keys(PRODUCTS);
const ALL_KEYS = IDS.flatMap((id) => PRODUCTS[id].components.map((c) => c.key));
const KEY_TO_ID = new Map(
  IDS.flatMap((id) => PRODUCTS[id].components.map((c) => [c.key, id]))
);

const strip = (s) => String(s ?? "").replace(/<[^>]*>/g, "");

async function search(keys, query, limit) {
  const url =
    `${API}/search?query=${encodeURIComponent(query)}&lang=en&start=0&limit=${limit}` +
    `&products=${encodeURIComponent(keys.join(","))}`;
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`search ${r.status}`);
  const j = await r.json();
  return (j.topics ?? []).map((t) => ({
    title: strip(t.title),
    href: t.href,
    product: KEY_TO_ID.get(t.product?.key) ?? t.product?.key,
  }));
}

/** 동시 요청 수 제한 (IBM API 에 과한 부하를 주지 않기 위해). */
async function pool(items, size, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        try { out[idx] = await fn(items[idx], idx); }
        catch (e) { out[idx] = { error: String(e) }; }
      }
    })
  );
  return out;
}

// ---------------------------------------------------------------- 라벨셋

function tocLeaves(items, out = []) {
  for (const it of items ?? []) {
    const kids = it.topics ?? [];
    if (kids.length === 0) {
      if (it.href && it.label) out.push({ title: it.label, href: it.href });
    } else tocLeaves(kids, out);
  }
  return out;
}

// 어느 제품에나 있는 제목은 라우팅 라벨로 부적절하다.
const GENERIC =
  /^(overview|introduction|getting started|welcome|release notes|what's new|whats new|troubleshooting|faq|glossary|prerequisites|installing|configuring|administering|security|reference|planning|upgrading|known issues|limitations|notices|about|home|index|tutorials?)\b/i;

async function buildLabels() {
  const labeled = [];
  for (const id of IDS) {
    const p = PRODUCTS[id];
    const all = [];
    for (const c of p.components) {
      try {
        const r = await fetch(`${API}/toc/${c.key}?lang=en`, { headers });
        if (!r.ok) { console.error(`  ! ${id}/${c.key}: TOC ${r.status}`); continue; }
        const j = await r.json();
        all.push(...tocLeaves(j.toc?.topics));
      } catch (e) { console.error(`  ! ${id}/${c.key}: ${e}`); }
    }
    const seen = new Set();
    const cand = all.filter((d) => {
      const t = d.title.trim();
      if (t.length < 12 || t.length > 70 || GENERIC.test(t)) return false;
      const k = t.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const step = Math.max(1, Math.floor(cand.length / PER_PRODUCT));
    const picked = [];
    for (let i = 0; i < cand.length && picked.length < PER_PRODUCT; i += step) picked.push(cand[i]);
    console.error(`  ${id.padEnd(10)} TOC leaf ${String(all.length).padStart(5)}  후보 ${String(cand.length).padStart(5)}  선택 ${picked.length}`);
    for (const d of picked) labeled.push({ product: id, query: d.title.trim(), href: d.href });
  }
  writeFileSync(LABELS, JSON.stringify(labeled, null, 2));
  return labeled;
}

// ---------------------------------------------------------------- 채점

const STOP = new Set(["the","a","an","of","for","to","in","on","and","or","with","using","use","your","by","from","is","are"]);
const toks = (s) =>
  new Set(String(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w)));

/** 질의와 제목의 어휘 겹침 (모델이 제목을 읽고 판단하는 것에 대한 근사치). */
function overlap(q, title) {
  const A = toks(q), B = toks(title);
  if (!A.size || !B.size) return 0;
  let hit = 0;
  for (const w of A) if (B.has(w)) hit++;
  return (2 * hit) / (A.size + B.size);
}

/** 통합 검색 결과에서 제품이 처음 등장한 순서. */
function productOrder(hits) {
  const order = [];
  for (const h of hits) if (h.product && !order.includes(h.product)) order.push(h.product);
  return order;
}

// ---------------------------------------------------------------- 실행

const labels =
  flag("--rebuild") || !existsSync(LABELS)
    ? (console.error("라벨셋 생성 중..."), await buildLabels())
    : JSON.parse(readFileSync(LABELS, "utf8"));

console.error(`\n라벨 ${labels.length}개 / 제품 ${IDS.length}종 / shortlist ${SHORTLIST}\n평가 중...\n`);

const results = await pool(labels, 4, async (lab) => {
  // 전략 A — 통합 랭킹 하나 (product 미지정 시의 소박한 구현)
  const global = await search(ALL_KEYS, lab.query, 20);
  const order = productOrder(global);
  const rank = order.indexOf(lab.product); // -1 = 결과에 아예 없음

  // 전략 B — 2단계: 통합 검색으로 후보를 추리고, 후보별로 개별 검색해 제목을 나란히
  const shortlist = order.slice(0, SHORTLIST);
  let bestByTitle = null, correctInShortlist = shortlist.includes(lab.product);
  if (correctInShortlist) {
    const perProduct = await pool(shortlist, 4, async (id) => {
      const hits = await search(PRODUCTS[id].components.map((c) => c.key), lab.query, 3);
      return { id, top: hits[0]?.title ?? "" };
    });
    let best = -1;
    for (const r of perProduct) {
      if (r?.error) continue;
      const s = overlap(lab.query, r.top);
      if (s > best) { best = s; bestByTitle = r.id; }
    }
  }
  // 전략 C - 검색 한 번(limit 40)을 제품별로 묶기만 한다. 추가 요청 없음.
  const wide = await search(ALL_KEYS, lab.query, 40);
  const grouped = new Map();
  for (const h of wide) {
    if (!h.product) continue;
    if (!grouped.has(h.product)) grouped.set(h.product, []);
    if (grouped.get(h.product).length < 3) grouped.get(h.product).push(h.title);
  }
  const cRecall = grouped.has(lab.product);
  let cBest = null, cScore = -1;
  for (const [id, titles] of grouped) {
    const sc = Math.max(...titles.map((t) => overlap(lab.query, t)));
    if (sc > cScore) { cScore = sc; cBest = id; }
  }

  return { ...lab, rank, order, shortlist, correctInShortlist, bestByTitle, cRecall, cBest, cGroups: grouped.size };
});

const ok = results.filter((r) => r && !r.error);
const pct = (n) => ((n / ok.length) * 100).toFixed(1).padStart(5) + "%";
const count = (f) => ok.filter(f).length;

console.log("=".repeat(64));
console.log(`라우팅 평가 — 라벨 ${ok.length}개`);
console.log("=".repeat(64));
console.log("\n[A] 통합 랭킹 하나만 쓸 때 (product 미지정 소박한 구현)");
console.log(`  정답 제품이 1위        ${pct(count((r) => r.rank === 0))}  (${count((r) => r.rank === 0)}/${ok.length})`);
console.log(`  정답 제품이 상위 3     ${pct(count((r) => r.rank >= 0 && r.rank < 3))}`);
console.log(`  정답 제품이 상위 ${String(SHORTLIST).padEnd(5)} ${pct(count((r) => r.rank >= 0 && r.rank < SHORTLIST))}`);
console.log(`  결과에 아예 없음       ${pct(count((r) => r.rank < 0))}`);

console.log(`\n[B] 2단계 라우팅 (후보 ${SHORTLIST}개 → 제품별 개별 검색 → 제목 비교)`);
console.log(`  후보에 정답 포함       ${pct(count((r) => r.correctInShortlist))}`);
console.log(`  제목 겹침 1위 = 정답   ${pct(count((r) => r.bestByTitle === r.product))}  ← 모델이 제목만 보고 고를 때의 근사치`);

console.log(`
[C] 검색 1회(limit 40)를 제품별로 묶기만 (추가 요청 0)`);
console.log(`  그룹에 정답 포함       ${pct(count((r) => r.cRecall))}`);
console.log(`  제목 겹침 1위 = 정답   ${pct(count((r) => r.cBest === r.product))}  <- B 와 같은 척도`);
console.log(`  평균 그룹 수           ${(ok.reduce((a, r) => a + (r.cGroups ?? 0), 0) / ok.length).toFixed(1)}개 제품`);

console.log("\n제품별 (정답이 통합랭킹 1위였던 비율 / 2단계 제목비교 적중률)");
for (const id of IDS) {
  const s = ok.filter((r) => r.product === id);
  if (!s.length) continue;
  const a = s.filter((r) => r.rank === 0).length / s.length;
  const b = s.filter((r) => r.bestByTitle === r.product).length / s.length;
  console.log(`  ${id.padEnd(10)} n=${String(s.length).padStart(2)}   A ${(a * 100).toFixed(0).padStart(3)}%   B ${(b * 100).toFixed(0).padStart(3)}%`);
}

const confused = {};
for (const r of ok) {
  if (r.bestByTitle && r.bestByTitle !== r.product) {
    const k = `${r.product} → ${r.bestByTitle}`;
    confused[k] = (confused[k] ?? 0) + 1;
  }
}
const pairs = Object.entries(confused).sort((a, b) => b[1] - a[1]).slice(0, 8);
if (pairs.length) {
  console.log("\n혼동이 잦은 쌍 (정답 → 잘못 고른 제품)");
  for (const [k, v] of pairs) console.log(`  ${k.padEnd(28)} ${v}회`);
}
console.log();
