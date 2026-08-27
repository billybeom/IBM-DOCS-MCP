import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
  });

  turndown.addRule("removeScripts", {
    filter: ["script", "style", "meta", "head", "title", "nav", "footer"],
    replacement: () => "",
  });

  turndown.addRule("code", {
    filter: "code",
    replacement: (content) => `\`${content}\``,
  });

  turndown.addRule("preserveTables", {
    filter: "table",
    replacement: (_content, node) => {
      const table = node as HTMLTableElement;
      const rows = Array.from(table.rows);
      if (rows.length === 0) return "";

      const headerCells = Array.from(rows[0].cells).map(
        (c) => c.textContent?.trim() || ""
      );
      const separator = headerCells.map(() => "---");
      const bodyRows = rows.slice(1).map((row) =>
        Array.from(row.cells).map((c) => c.textContent?.trim() || "")
      );

      const lines = [
        `| ${headerCells.join(" | ")} |`,
        `| ${separator.join(" | ")} |`,
        ...bodyRows.map((r) => `| ${r.join(" | ")} |`),
      ];
      return `\n${lines.join("\n")}\n`;
    },
  });

  return turndown
    .turndown(html)
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .replace(/^\s+|\s+$/g, "");
}

export function extractAndConvert(html: string): string {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const main =
    doc.querySelector("main") ||
    doc.querySelector("article") ||
    doc.querySelector(".body") ||
    doc.querySelector("body");

  if (!main) return htmlToMarkdown(html);

  const remove = main.querySelectorAll("script, style, meta, nav, footer");
  remove.forEach((el) => el.remove());

  return htmlToMarkdown(main.innerHTML);
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
