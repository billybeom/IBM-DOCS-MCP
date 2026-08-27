import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, type ZodRawShape } from "zod";
import {
  searchDocs,
  fetchToc,
  fetchDocContent,
  type ComponentToc,
  type TocItem,
} from "./ibm-docs-api.js";
import { extractAndConvert, stripHtmlTags } from "./utils.js";
import { capText } from "./toc-view.js";
import type { ProductDefinition } from "./products.js";

// lang 파라미터를 노출하는 제품(현재 IWHI)에서만 쓰인다.
const LANG_HINT_SEARCH =
  "Language: 'en' (English, default — widest coverage) or 'ko' (Korean)";
const LANG_HINT = "Language: 'en' or 'ko'";

/** 제품 정의로부터 툴 3개가 등록된 MCP 서버를 만든다. */
export function createServer(product: ProductDefinition): McpServer {
  const server = new McpServer({
    name: product.serverName,
    version: product.version,
  });

  const keys = product.components.map((c) => c.key);
  // 구성 제품이 여럿이면 TOC 를 제품별로 그룹핑하고 product 필터를 노출한다.
  const grouped = product.components.length > 1;
  const langEnum = product.langs
    ? z.enum(product.langs as unknown as [string, ...string[]])
    : undefined;

  // Tool 1: 문서 검색
  const searchShape = {
    query: z.string().describe(product.search.queryHint),
    ...(langEnum
      ? { lang: langEnum.optional().default("en").describe(LANG_HINT_SEARCH) }
      : {}),
    start: z
      .number()
      .min(0)
      .optional()
      .default(0)
      .describe("Result offset for pagination (0 or greater)"),
    limit: z.number().optional().default(10).describe("Number of results (max 20)"),
  } as ZodRawShape;

  server.tool(
    product.search.toolName,
    product.search.description,
    searchShape,
    async (args) => {
      const { query, lang, start, limit } = args as {
        query: string;
        lang?: string;
        start: number;
        limit: number;
      };
      try {
        const result = await searchDocs(keys, query, lang, start, Math.min(limit, 20));
        const formatted = result.topics.map((t) => ({
          title: stripHtmlTags(t.title),
          url: t.fullurl,
          snippet: stripHtmlTags(t.snippet),
          href: t.href,
          date: t.date,
          readTime: `${t.readTime}min`,
        }));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  totalHits: result.hits,
                  showing: `${start + 1}-${start + formatted.length}`,
                  results: formatted,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Search error: ${error}` }],
          isError: true,
        };
      }
    }
  );

  // Tool 2: 문서 페이지 읽기
  const readShape = {
    href: z.string().describe(product.read.hrefHint),
    ...(langEnum
      ? { lang: langEnum.optional().default("en").describe(LANG_HINT) }
      : {}),
  } as ZodRawShape;

  server.tool(
    product.read.toolName,
    product.read.description,
    readShape,
    async (args) => {
      const { href, lang } = args as { href: string; lang?: string };
      try {
        const html = await fetchDocContent(href, lang);
        const markdown = extractAndConvert(html);
        return {
          content: [{ type: "text" as const, text: markdown }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Read error: ${error}` }],
          isError: true,
        };
      }
    }
  );

  // Tool 3: 목차(TOC) 조회
  const tocShape = {
    ...(grouped
      ? { product: z.string().optional().describe(product.toc.productHint ?? "") }
      : {}),
    section: z.string().optional().describe(product.toc.sectionHint),
    ...(langEnum
      ? { lang: langEnum.optional().default("en").describe(LANG_HINT) }
      : {}),
  } as ZodRawShape;

  server.tool(
    product.toc.toolName,
    product.toc.description,
    tocShape,
    async (args) => {
      const {
        product: productFilter,
        section,
        lang,
      } = args as { product?: string; section?: string; lang?: string };

      try {
        let results = await fetchToc(product.components, lang);

        if (grouped && productFilter) {
          const lower = productFilter.toLowerCase();
          // 정확 매칭 우선. "API Connect"가 "API Connect for GraphQL"까지
          // 끌고 오지 않도록, 부분 문자열 매칭은 정확히 걸리는 게 없을 때만 쓴다.
          const exact = results.filter(
            (r) => r.key.toLowerCase() === lower || r.label.toLowerCase() === lower
          );
          const matched =
            exact.length > 0
              ? exact
              : results.filter(
                  (r) =>
                    r.label.toLowerCase().includes(lower) ||
                    r.key.toLowerCase().includes(lower)
                );
          if (matched.length === 0) {
            const available = results.map((r) => `${r.label} (${r.key})`).join(", ");
            return {
              content: [
                {
                  type: "text" as const,
                  text: `No component product matching "${productFilter}" was found. Available: ${available}.`,
                },
              ],
            };
          }
          results = matched;
        }

        // 전체 트리를 펼치는 조건은 section 뿐이다. 구성 제품 하나로 좁혀도
        // 펼치면 5만자를 넘겨 클라이언트의 툴 결과 크기 제한에 걸린다.
        const maxDepth = section ? Infinity : 1;

        function formatToc(items: TocItem[], depth = 0): string {
          return items
            .map((item) => {
              const indent = "  ".repeat(depth);
              let line = `${indent}- ${item.label}`;
              if (item.href) line += ` [${item.href}]`;
              const kids = item.topics ?? [];
              if (kids.length > 0) {
                if (depth + 1 < maxDepth) {
                  line += "\n" + formatToc(kids, depth + 1);
                } else {
                  line += ` _(+${kids.length} subtopics)_`;
                }
              }
              return line;
            })
            .join("\n");
        }

        /** 섹션 필터 적용. 걸리는 게 없으면 null. */
        function sectionTopics(entry: ComponentToc): TocItem[] | null {
          const topics = entry.toc!.toc.topics;
          if (!section) return topics;
          const lower = section.toLowerCase();
          const filtered = topics.filter(
            (t) =>
              t.label.toLowerCase().includes(lower) ||
              t.topicId.toLowerCase().includes(lower)
          );
          return filtered.length > 0 ? filtered : null;
        }

        const heading = `# ${product.tocHeading} - Table of Contents`;

        if (!grouped) {
          const topics = sectionTopics(results[0]);
          if (topics === null) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `No top-level section matching "${section}" was found. Call this tool without 'section' to list the available sections.`,
                },
              ],
            };
          }
          return {
            content: [
              {
                type: "text" as const,
                text: capText(
                  `${heading}\n\n${formatToc(topics)}` +
                    (section
                      ? ""
                      : `\n\n_Showing top-level sections only. Pass \`section\` to expand the full tree._`),
                  "`section` 을 더 좁히세요."
                ),
              },
            ],
          };
        }

        const blocks = results.map((r) => {
          if (r.error || !r.toc) {
            return `## ${r.label} (${r.key})\n\n_TOC unavailable: ${r.error ?? "unknown error"}_`;
          }
          const topics = sectionTopics(r);
          // 섹션 필터에 걸리는 게 없으면 이 제품은 건너뛴다.
          if (topics === null) return null;
          return `## ${r.label} (${r.key})\n\n${formatToc(topics)}`;
        });

        const body = blocks.filter((b): b is string => b !== null).join("\n\n");
        const hint = section
          ? ""
          : `\n\n_Showing top-level sections only. Pass \`section\` to expand the full tree, or \`product\` (e.g. "${product.toc.productExample}") to narrow to one component product._`;

        return {
          content: [
            {
              type: "text" as const,
              text: capText(
                `${heading}\n\n` +
                  (body || `_No sections matched the given filters._`) +
                  hint,
                "`product` 로 구성 제품 하나를 고르거나 `section` 을 더 좁히세요."
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `TOC error: ${error}` }],
          isError: true,
        };
      }
    }
  );

  return server;
}

/** 서버를 만들어 stdio 로 붙인다. 각 <제품>-docs-mcp 엔트리가 호출한다. */
export async function runServer(product: ProductDefinition): Promise<void> {
  try {
    const server = createServer(product);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(product.startupMessage);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}
