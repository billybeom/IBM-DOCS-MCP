// 통합 서버 — 제품별로 툴을 복제하는 대신 툴 3개에 product 파라미터를 둔다.
// 제품이 몇 개든 툴은 3개이고, 제품 추가 비용은 enum 설명 한 줄이다.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, type ZodRawShape } from "zod";
import {
  searchDocs,
  fetchToc,
  fetchDocContent,
  type SearchResultTopic,
} from "./ibm-docs-api.js";
import { extractAndConvert, stripHtmlTags } from "./utils.js";
import { PRODUCTS, type ProductDefinition } from "./products.js";
import { buildProductDescription } from "./routing-hints.js";
import {
  formatToc,
  filterSections,
  pickByNameOrKey,
  renderGrouped,
} from "./toc-view.js";

/**
 * 라우팅 모드에서 한 번에 가져오는 검색 결과 수.
 * scripts/eval-routing.mjs 측정 결과 limit 40 을 제품별로 묶으면
 * 정답 제품이 결과에 포함될 확률이 100% 였다 (평균 3.5개 그룹).
 */
const ROUTING_LIMIT = 40;
/** 라우팅 모드에서 제품당 보여주는 제목 수. */
const ROUTING_PER_PRODUCT = 3;

const LANG_HINT = "Language: 'en' or 'ko'";

/** IBM_DOCS_PRODUCTS 로 노출할 제품을 좁힌다. 미지정이면 전체. */
export function selectProducts(
  env: NodeJS.ProcessEnv = process.env
): ProductDefinition[] {
  const raw = env.IBM_DOCS_PRODUCTS?.trim();
  const all = Object.values(PRODUCTS) as ProductDefinition[];
  if (!raw) return all;

  const wanted = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const picked: ProductDefinition[] = [];
  const unknown: string[] = [];
  for (const id of wanted) {
    const p = (PRODUCTS as Record<string, ProductDefinition>)[id];
    if (p) picked.push(p);
    else unknown.push(id);
  }
  if (unknown.length) {
    console.error(
      `[ibm-docs] 알 수 없는 제품 id 무시: ${unknown.join(", ")} ` +
        `(사용 가능: ${Object.keys(PRODUCTS).join(", ")})`
    );
  }
  if (picked.length === 0) {
    console.error("[ibm-docs] IBM_DOCS_PRODUCTS 에 유효한 id 가 없어 전체를 노출합니다.");
    return all;
  }
  return picked;
}

export function createUnifiedServer(products: ProductDefinition[]): McpServer {
  const server = new McpServer({ name: "ibm-docs", version: "1.0.0" });

  const byId = new Map(products.map((p) => [p.id, p]));
  // 제품이 하나면 product 파라미터를 아예 만들지 않는다 — 없는 인자는 틀릴 수 없다.
  const multi = products.length > 1;
  const anyLang = products.some((p) => p.langs);
  const langEnum = anyLang ? z.enum(["ko", "en"]) : undefined;

  const productEnum = multi
    ? z
        .enum(products.map((p) => p.id) as [string, ...string[]])
        .optional()
        .describe(
          buildProductDescription(
            products.map((p) => ({ id: p.id, label: p.tocHeading }))
          )
        )
    : undefined;

  /** 검색 결과의 제품 키 → 제품 id / 구성 제품 라벨. */
  const keyIndex = new Map<string, { id: string; component: string }>();
  for (const p of products)
    for (const c of p.components) keyIndex.set(c.key, { id: p.id, component: c.label });

  const keysOf = (ps: ProductDefinition[]) =>
    ps.flatMap((p) => p.components.map((c) => c.key));

  const describe = (t: SearchResultTopic) => {
    const meta = keyIndex.get(t.product?.key);
    const p = meta ? byId.get(meta.id) : undefined;
    return {
      title: stripHtmlTags(t.title),
      url: t.fullurl,
      snippet: stripHtmlTags(t.snippet),
      href: t.href,
      date: t.date,
      readTime: `${t.readTime}min`,
      ...(multi && meta ? { product: meta.id } : {}),
      // 구성 제품이 여럿인 제품(iwhi, instana)은 어느 구성인지가 중요하다.
      ...(meta && p && p.components.length > 1 ? { component: meta.component } : {}),
    };
  };

  const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

  /**
   * TOC 는 좁혀도 커질 수 있다. 클라이언트마다 툴 결과 크기 제한이 있고
   * 넘기면 결과가 통째로 버려지므로, 넘칠 때는 잘라서라도 쓸 수 있게 돌려준다.
   */
  const TOC_MAX_CHARS = 24000;
  const capped = (body: string, how: string) =>
    body.length <= TOC_MAX_CHARS
      ? text(body)
      : text(
          body.slice(0, TOC_MAX_CHARS) +
            `\n\n_...잘렸습니다 (${body.length}자 중 ${TOC_MAX_CHARS}자). ${how}_`
        );
  const fail = (s: string) => ({ ...text(s), isError: true });

  // ---------------------------------------------------------------- search

  server.tool(
    "search_ibm_docs",
    "Search IBM product documentation. Give 'product' to search one product; omit it to search everything and get results grouped by product (use that to work out which product to narrow to).",
    {
      query: z.string().describe("Search query (e.g. 'oauth provider', 'rate limit', 'kubernetes monitoring')"),
      ...(productEnum ? { product: productEnum } : {}),
      ...(langEnum
        ? { lang: langEnum.optional().default("en").describe("Language: 'en' (English, default — widest coverage) or 'ko' (Korean)") }
        : {}),
      start: z.number().min(0).optional().default(0).describe("Result offset for pagination (0 or greater). Ignored when 'product' is omitted."),
      limit: z.number().optional().default(10).describe("Number of results (max 20). Ignored when 'product' is omitted."),
    } as ZodRawShape,
    async (args) => {
      const { query, product, lang, start, limit } = args as {
        query: string; product?: string; lang?: string; start: number; limit: number;
      };
      try {
        const target = product ? byId.get(product) : undefined;

        // 라우팅 모드 — 제품을 특정하지 않았고 후보가 여럿일 때.
        if (!target && multi) {
          const res = await searchDocs(keysOf(products), query, lang, 0, ROUTING_LIMIT);
          const groups = new Map<string, ReturnType<typeof describe>[]>();
          for (const t of res.topics) {
            const meta = keyIndex.get(t.product?.key);
            if (!meta) continue;
            const bucket = groups.get(meta.id) ?? [];
            if (bucket.length < ROUTING_PER_PRODUCT) bucket.push(describe(t));
            groups.set(meta.id, bucket);
          }
          return text(
            JSON.stringify(
              {
                mode: "routing",
                note:
                  "'product' 를 지정하지 않아 제품별 상위 결과만 묶어 보여줍니다. " +
                  "어느 제품인지 정해지면 product 를 지정해 다시 검색하세요.",
                totalHits: res.hits,
                byProduct: [...groups].map(([id, topics]) => ({
                  product: id,
                  label: byId.get(id)?.tocHeading ?? id,
                  topics,
                })),
              },
              null,
              2
            )
          );
        }

        // 일반 검색 — 제품 하나가 정해진 경우.
        const scope = target ? [target] : products;
        const res = await searchDocs(keysOf(scope), query, lang, start, Math.min(limit, 20));
        const results = res.topics.map(describe);
        return text(
          JSON.stringify(
            {
              ...(target && multi ? { product: target.id } : {}),
              totalHits: res.hits,
              showing: `${start + 1}-${start + results.length}`,
              results,
            },
            null,
            2
          )
        );
      } catch (error) {
        return fail(`Search error: ${error}`);
      }
    }
  );

  // ------------------------------------------------------------------ read

  server.tool(
    "read_ibm_doc",
    "Read a specific IBM documentation page and return its content as Markdown. Use the 'href' from search results or the table of contents. No product argument is needed — the href already carries it.",
    {
      href: z.string().describe("Document href path from a search result or TOC (e.g. 'SSMNED_12.1.x_cd/com.ibm.apic.overview.doc/api_management_overview.html')"),
      ...(langEnum ? { lang: langEnum.optional().default("en").describe(LANG_HINT) } : {}),
    } as ZodRawShape,
    async (args) => {
      const { href, lang } = args as { href: string; lang?: string };
      try {
        return text(extractAndConvert(await fetchDocContent(href, lang)));
      } catch (error) {
        return fail(`Read error: ${error}`);
      }
    }
  );

  // ------------------------------------------------------------------- toc

  server.tool(
    "get_ibm_toc",
    "Get the table of contents for IBM product documentation. Call with no arguments to list the available products; give 'product' for its top-level sections; add 'section' to expand the full tree.",
    {
      ...(productEnum
        ? {
            product: z
              .enum(products.map((p) => p.id) as [string, ...string[]])
              .optional()
              .describe("Product whose table of contents to show. Omit to list the available products."),
          }
        : {}),
      component: z.string().optional().describe("Optional: for products made of several component products (e.g. 'iwhi', 'instana'), narrow to one component by name or key."),
      section: z.string().optional().describe("Optional: filter to a specific top-level section by label (e.g. 'Installing', 'Security')"),
      ...(langEnum ? { lang: langEnum.optional().default("en").describe(LANG_HINT) } : {}),
    } as ZodRawShape,
    async (args) => {
      const { product, component, section, lang } = args as {
        product?: string; component?: string; section?: string; lang?: string;
      };
      try {
        const target = product ? byId.get(product) : multi ? undefined : products[0];

        // 제품 카탈로그 — 제품을 정하지 않았을 때. 라우팅의 출발점이기도 하다.
        if (!target) {
          const rows = products.map((p) => {
            const extra =
              p.components.length > 1
                ? ` — 구성 제품 ${p.components.length}: ${p.components.map((c) => c.label).join(", ")}`
                : "";
            return `- \`${p.id}\` ${p.tocHeading}${extra}`;
          });
          return text(
            [
              "# IBM Docs — 사용 가능한 제품",
              "",
              ...rows,
              "",
              "_`product` 를 지정하면 해당 제품의 최상위 섹션을, `section` 까지 주면 전체 트리를 보여줍니다._",
            ].join("\n")
          );
        }

        let results = await fetchToc(target.components, lang);

        if (component && target.components.length > 1) {
          const matched = pickByNameOrKey(results, component);
          if (matched.length === 0) {
            const available = results.map((r) => `${r.label} (${r.key})`).join(", ");
            return text(`No component matching "${component}" was found in "${target.id}". Available: ${available}.`);
          }
          results = matched;
        }

        // 전체 트리를 펼치는 조건은 section 뿐이다. component 로만 좁혀도 펼치면
        // 구성 제품 하나가 5만자를 넘겨 클라이언트의 툴 결과 크기 제한에 걸린다.
        const maxDepth = section ? Infinity : 1;
        const heading = `# ${target.tocHeading} - Table of Contents`;
        const hint = section
          ? ""
          : "\n\n_Showing top-level sections only. Pass `section` to expand the full tree._";

        // 구성 제품이 여럿인 제품은 component 로 하나만 남겨도 그룹 렌더러를 쓴다.
        // 그래야 "## App Connect (SSJ8I7)" 처럼 어느 구성인지가 드러난다.
        if (target.components.length > 1) {
          const body = renderGrouped(results, section, maxDepth);
          return capped(
            `${heading}\n\n` + (body || "_No sections matched the given filters._") + hint,
            "`component` 로 구성 제품 하나를 고르거나 `section` 을 더 좁히세요."
          );
        }

        const only = results[0];
        if (only.error || !only.toc) {
          return fail(`TOC error: ${only.error ?? "unknown error"}`);
        }
        const topics = filterSections(only.toc.toc.topics, section);
        if (topics === null) {
          return text(`No top-level section matching "${section}" was found in "${target.id}". Call this tool without 'section' to list the available sections.`);
        }
        return capped(
          `${heading}\n\n${formatToc(topics, maxDepth)}` + hint,
          "`section` 을 더 좁히세요."
        );
      } catch (error) {
        return fail(`TOC error: ${error}`);
      }
    }
  );

  return server;
}

export async function runUnifiedServer(
  products: ProductDefinition[] = selectProducts()
): Promise<void> {
  try {
    const server = createUnifiedServer(products);
    await server.connect(new StdioServerTransport());
    console.error(
      `IBM Docs MCP server running on stdio (products: ${products.map((p) => p.id).join(", ")})`
    );
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}
