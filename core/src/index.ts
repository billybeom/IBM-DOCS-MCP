export { createServer, runServer } from "./server.js";
export { createUnifiedServer, runUnifiedServer, selectProducts } from "./unified.js";
export { PRODUCTS, type ProductDefinition, type ProductComponent, type ProductId } from "./products.js";
export { BLURBS, OVERLAP_NOTES, buildProductDescription } from "./routing-hints.js";
export { formatToc, filterSections, pickByNameOrKey, renderGrouped, capText, TOC_MAX_CHARS } from "./toc-view.js";
export { installDiagnostics } from "./diagnostics.js";
export {
  searchDocs,
  fetchToc,
  fetchDocContent,
  type SearchResponse,
  type SearchResultTopic,
  type ComponentToc,
  type TocItem,
  type TocResponse,
} from "./ibm-docs-api.js";
export { extractAndConvert, htmlToMarkdown, stripHtmlTags } from "./utils.js";
