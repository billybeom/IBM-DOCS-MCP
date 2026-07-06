const PRODUCT_KEY = "SSP8GWM_12.1.1";
// (코드 내에 IDIG URL이 있다면) https://www.ibm.com/docs/en/dp-interact-gateway/12.1.1/..."

const BASE_URL = "https://www.ibm.com/docs";

const API_BASE = `${BASE_URL}/api/v1`;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const headers = {
  "User-Agent": USER_AGENT,
  Accept: "application/json",
};

export interface SearchResultTopic {
  title: string;
  fullurl: string;
  snippet: string;
  date: string;
  href: string;
  product: { key: string; label: string };
  readTime: number;
  productBreadCrumb: string;
}

export interface SearchResponse {
  hits: number;
  start: number;
  previous: number;
  next: number;
  topics: SearchResultTopic[];
}

export interface TocItem {
  topicId: string;
  href: string;
  label: string;
  topics?: TocItem[];
}

export interface TocResponse {
  _id: string;
  toc: {
    href: string;
    label: string;
    topicId: string;
    topics: TocItem[];
  };
}

export async function searchDocs(
  query: string,
  start = 0,
  limit = 10
): Promise<SearchResponse> {
  const url = `${API_BASE}/search?query=${encodeURIComponent(query)}&lang=en&start=${start}&limit=${limit}&products=${PRODUCT_KEY}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SearchResponse>;
}

export async function fetchToc(): Promise<TocResponse> {
  const url = `${API_BASE}/toc/${PRODUCT_KEY}?lang=en`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`TOC fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<TocResponse>;
}

export async function fetchDocContent(href: string): Promise<string> {
  const url = `${API_BASE}/content/${href}?parsebody=true&lang=en`;
  const res = await fetch(url, {
    headers: { ...headers, Accept: "text/html" },
  });
  if (!res.ok) {
    throw new Error(`Content fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.text();
}
