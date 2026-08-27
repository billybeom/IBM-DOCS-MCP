// TOC 렌더링 공용 로직. 제품별 레거시 서버(server.ts)와 통합 서버(unified.ts)가 함께 쓴다.

import type { ComponentToc, TocItem } from "./ibm-docs-api.js";

/** 트리를 마크다운 목록으로. maxDepth 를 넘는 하위는 개수만 표시한다. */
export function formatToc(items: TocItem[], maxDepth: number, depth = 0): string {
  return items
    .map((item) => {
      const indent = "  ".repeat(depth);
      let line = `${indent}- ${item.label}`;
      if (item.href) line += ` [${item.href}]`;
      const kids = item.topics ?? [];
      if (kids.length > 0) {
        if (depth + 1 < maxDepth) {
          line += "\n" + formatToc(kids, maxDepth, depth + 1);
        } else {
          line += ` _(+${kids.length} subtopics)_`;
        }
      }
      return line;
    })
    .join("\n");
}

/** 최상위 섹션을 라벨/topicId 로 거른다. 걸리는 게 없으면 null. */
export function filterSections(
  topics: TocItem[],
  section?: string
): TocItem[] | null {
  if (!section) return topics;
  const lower = section.toLowerCase();
  const filtered = topics.filter(
    (t) =>
      t.label.toLowerCase().includes(lower) ||
      t.topicId.toLowerCase().includes(lower)
  );
  return filtered.length > 0 ? filtered : null;
}

/**
 * 이름/키로 항목을 고른다. 정확 매칭 우선 —
 * "API Connect" 가 "API Connect for GraphQL" 까지 끌고 오지 않도록,
 * 부분 문자열 매칭은 정확히 걸리는 게 없을 때만 쓴다.
 */
export function pickByNameOrKey<T extends { key: string; label: string }>(
  items: T[],
  needle: string
): T[] {
  const lower = needle.toLowerCase();
  const exact = items.filter(
    (r) => r.key.toLowerCase() === lower || r.label.toLowerCase() === lower
  );
  if (exact.length > 0) return exact;
  return items.filter(
    (r) =>
      r.label.toLowerCase().includes(lower) || r.key.toLowerCase().includes(lower)
  );
}

/** 구성 제품별 블록 렌더링. 섹션 필터에 걸리는 게 없는 제품은 건너뛴다. */
export function renderGrouped(
  results: ComponentToc[],
  section: string | undefined,
  maxDepth: number
): string {
  const blocks = results.map((r) => {
    if (r.error || !r.toc) {
      return `## ${r.label} (${r.key})\n\n_TOC unavailable: ${r.error ?? "unknown error"}_`;
    }
    const topics = filterSections(r.toc.toc.topics, section);
    if (topics === null) return null;
    return `## ${r.label} (${r.key})\n\n${formatToc(topics, maxDepth)}`;
  });
  return blocks.filter((b): b is string => b !== null).join("\n\n");
}
