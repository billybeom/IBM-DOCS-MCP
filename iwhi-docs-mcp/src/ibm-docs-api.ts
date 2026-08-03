// IBM webMethods Hybrid Integration (IWHI)
// 단일 제품이 아니라 구성 제품별로 문서가 나뉘어 있어 전체를 묶어서 조회한다.
export const PRODUCTS: { key: string; label: string }[] = [
  { key: "SSC74RW_saas", label: "Hybrid Integration SaaS" },
  { key: "SSGOVO", label: "webMethods Integration" },
  { key: "SSJ8I7", label: "App Connect" },
  { key: "SSFQ7G1_12.1.0", label: "API Connect 12.1.0" },
  { key: "SSFQ7G1_10.0.x", label: "API Connect 10.0.x" },
  { key: "SSMQ84", label: "webMethods B2B Integration" },
  { key: "SSXAAZY", label: "webMethods API Gateway" },
  { key: "SSMBFW", label: "Event Endpoint Management" },
  { key: "SSO4MT7", label: "webMethods Developer Portal" },
  { key: "SSS4PI", label: "API Connect for GraphQL" },
];

const PRODUCT_KEY = PRODUCTS.map((p) => p.key).join(",");
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
  lang = "en",
  start = 0,
  limit = 10
): Promise<SearchResponse> {
  const url = `${API_BASE}/search?query=${encodeURIComponent(query)}&lang=${lang}&start=${start}&limit=${limit}&products=${encodeURIComponent(PRODUCT_KEY)}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SearchResponse>;
}

/** 구성 제품 하나의 TOC. 실패한 제품은 error에 사유가 담긴다. */
export interface ProductToc {
  key: string;
  label: string;
  toc?: TocResponse;
  error?: string;
}

/** 구성 제품 전체의 TOC를 병렬 조회한다. 일부가 실패해도 나머지는 반환한다. */
export async function fetchToc(lang = "en"): Promise<ProductToc[]> {
  return Promise.all(
    PRODUCTS.map(async ({ key, label }) => {
      try {
        const res = await fetch(`${API_BASE}/toc/${key}?lang=${lang}`, { headers });
        if (!res.ok) {
          return { key, label, error: `${res.status} ${res.statusText}` };
        }
        return { key, label, toc: (await res.json()) as TocResponse };
      } catch (e) {
        return { key, label, error: String(e) };
      }
    })
  );
}

export async function fetchDocContent(href: string, lang = "en"): Promise<string> {
  const url = `${API_BASE}/content/${href}?parsebody=true&lang=${lang}`;
  const res = await fetch(url, {
    headers: { ...headers, Accept: "text/html" },
  });
  if (!res.ok) {
    throw new Error(`Content fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.text();
}
