// jsdom/turndown 은 read 툴에서만 쓰는데, top-level import 하면
// server.connect() 전에 전부 로드되어 기동이 느려진다. 콜드 파일 캐시에서 특히 크다
// (jsdom 계열만 node_modules 파일의 17.5% 를 차지한다).
// 타입은 type-only 로 유지하고(런타임에 지워짐), 실체는 첫 사용 시점에 동기 로드한다.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type TurndownCtor = typeof import("turndown");
type JSDOMCtor = (typeof import("jsdom"))["JSDOM"];

let turndownCtor: TurndownCtor | undefined;
let jsdomCtor: JSDOMCtor | undefined;

const loadTurndown = (): TurndownCtor =>
  (turndownCtor ??= require("turndown") as TurndownCtor);

const loadJSDOM = (): JSDOMCtor =>
  (jsdomCtor ??= (require("jsdom") as typeof import("jsdom")).JSDOM);

export function htmlToMarkdown(html: string): string {
  const turndown = new (loadTurndown())({
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
  const dom = new (loadJSDOM())(html);
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
