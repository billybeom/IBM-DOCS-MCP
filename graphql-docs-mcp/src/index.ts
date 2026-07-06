#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchDocs, fetchToc, fetchDocContent, type TocItem } from "./ibm-docs-api.js";
import { extractAndConvert, stripHtmlTags } from "./utils.js";

const server = new McpServer({
  name: "graphql-docs",
  version: "1.0.0",
});

// Tool 1: 문서 검색
server.tool(
  "search_graphql_docs",
  "Search IBM API Connect for GraphQL Software 1.1.x documentation. Returns matching topics with titles, snippets, and URLs.",
  {
    query: z.string().describe("Search query (e.g. 'gateway', 'oauth', 'catalog')"),
    start: z.number().optional().default(0).describe("Result offset for pagination"),
    limit: z.number().optional().default(10).describe("Number of results (max 20)"),
  },
  async ({ query, start, limit }) => {
    try {
      const result = await searchDocs(query, start, Math.min(limit, 20));
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
server.tool(
  "read_graphql_doc",
  "Read a specific IBM API Connect for GraphQL Software 1.1.x documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
  {
    href: z
      .string()
      .describe(
        "Document href path (e.g. 'SSP8GWM_12.1.1/com.ibm.dp.interact.overview.doc/gateway_overview.html')"
      ),
  },
  async ({ href }) => {
    try {
      const html = await fetchDocContent(href);
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
server.tool(
  "get_graphql_toc",
  "Get the table of contents for IBM API Connect for GraphQL Software 1.1.x documentation. Shows the full document structure with sections and topics.",
  {
    section: z
      .string()
      .optional()
      .describe("Optional: filter to a specific section by label (e.g. 'Installing', 'Security')"),
  },
  async ({ section }) => {
    try {
      const toc = await fetchToc();
      let topics = toc.toc.topics;

      if (section) {
        const lower = section.toLowerCase();
        const filtered = topics.filter(
          (t) =>
            t.label.toLowerCase().includes(lower) ||
            t.topicId.toLowerCase().includes(lower)
        );
        if (filtered.length > 0) {
          topics = filtered;
        }
      }

      function formatToc(items: TocItem[], depth = 0): string {
        return items
          .map((item) => {
            const indent = "  ".repeat(depth);
            let line = `${indent}- ${item.label}`;
            if (item.href) line += ` [${item.href}]`;
            if (item.topics && item.topics.length > 0) {
              line += "\n" + formatToc(item.topics, depth + 1);
            }
            return line;
          })
          .join("\n");
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `# IBM API Connect for GraphQL Software 1.1.x - Table of Contents\n\n${formatToc(topics)}`,
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
  console.error("GraphQL Docs MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
