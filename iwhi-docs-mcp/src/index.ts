#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchDocs, fetchToc, fetchDocContent, type TocItem } from "./ibm-docs-api.js";
import { extractAndConvert, stripHtmlTags } from "./utils.js";

const server = new McpServer({
  name: "iwhi-docs",
  version: "1.0.0",
});

server.tool(
  "search_iwhi_docs",
  "Search IBM webMethods Hybrid Integration (IWHI) documentation across all component products: webMethods Integration, App Connect, API Connect, B2B Integration, API Gateway, Event Endpoint Management, Developer Portal, and API Connect for GraphQL. Returns matching topics with titles, snippets, and URLs.",
  {
    query: z.string().describe("Search query (e.g. 'API gateway', 'flow service', 'connector')"),
    lang: z.enum(["ko", "en"]).optional().default("en").describe("Language: 'en' (English, default — widest coverage) or 'ko' (Korean)"),
    start: z.number().min(0).optional().default(0).describe("Result offset for pagination (0 or greater)"),
    limit: z.number().optional().default(10).describe("Number of results (max 20)"),
  },
  async ({ query, lang, start, limit }) => {
    try {
      const result = await searchDocs(query, lang, start, Math.min(limit, 20));
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

server.tool(
  "read_iwhi_doc",
  "Read a specific IBM webMethods Hybrid Integration documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
  {
    href: z
      .string()
      .describe(
        "Document href path, starting with the component product key (e.g. 'SSGOVO/...', 'SSJ8I7/...', 'SSXAAZY/...')"
      ),
    lang: z.enum(["ko", "en"]).optional().default("en").describe("Language: 'en' or 'ko'"),
  },
  async ({ href, lang }) => {
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

server.tool(
  "get_iwhi_toc",
  "Get the table of contents for IBM webMethods Hybrid Integration documentation, grouped by component product. Use 'product' to narrow to one component and 'section' to filter sections by label.",
  {
    product: z
      .string()
      .optional()
      .describe(
        "Optional: filter to one component product by name or key (e.g. 'App Connect', 'API Gateway', 'SSGOVO')"
      ),
    section: z
      .string()
      .optional()
      .describe("Optional: filter to a specific section by label (e.g. 'Installing', 'Security', 'Administering')"),
    lang: z.enum(["ko", "en"]).optional().default("en").describe("Language: 'en' or 'ko'"),
  },
  async ({ product, section, lang }) => {
    try {
      let results = await fetchToc(lang);

      if (product) {
        const lower = product.toLowerCase();
        const narrowed = results.filter(
          (r) =>
            r.label.toLowerCase().includes(lower) ||
            r.key.toLowerCase().includes(lower)
        );
        if (narrowed.length > 0) {
          results = narrowed;
        }
      }

      // 필터가 없으면 구성 제품 전체 트리가 수백 KB에 달해 컨텍스트를 소모한다.
      // 좁히지 않은 요청은 최상위 섹션까지만 보여주고 좁히는 방법을 안내한다.
      const narrowed = Boolean(product || section);
      const maxDepth = narrowed ? Infinity : 1;

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

      const blocks = results.map((r) => {
        if (r.error || !r.toc) {
          return `## ${r.label} (${r.key})\n\n_TOC unavailable: ${r.error ?? "unknown error"}_`;
        }
        let topics = r.toc.toc.topics;
        if (section) {
          const lower = section.toLowerCase();
          const filtered = topics.filter(
            (t) =>
              t.label.toLowerCase().includes(lower) ||
              t.topicId.toLowerCase().includes(lower)
          );
          // 섹션 필터에 걸리는 게 없으면 이 제품은 건너뛴다.
          if (filtered.length === 0) return null;
          topics = filtered;
        }
        return `## ${r.label} (${r.key})\n\n${formatToc(topics)}`;
      });

      const body = blocks.filter((b): b is string => b !== null).join("\n\n");
      const hint = narrowed
        ? ""
        : `\n\n_Showing top-level sections only. Pass \`product\` (e.g. "App Connect") or \`section\` to expand the full tree._`;

      return {
        content: [
          {
            type: "text" as const,
            text:
              `# IBM webMethods Hybrid Integration - Table of Contents\n\n` +
              (body || `_No sections matched the given filters._`) +
              hint,
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("IBM webMethods Hybrid Integration Docs MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
