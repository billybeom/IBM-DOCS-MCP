// IBM Docs API (https://www.ibm.com/docs/api/v1) 클라이언트.
// 제품 키는 호출자가 넘긴다 — 단일 제품이면 1개, IWHI 처럼 구성 제품이 여럿이면 N개.

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

/** 구성 제품 하나의 TOC. 실패한 제품은 error 에 사유가 담긴다. */
export interface ComponentToc {
  key: string;
  label: string;
  toc?: TocResponse;
  error?: string;
}

export async function searchDocs(
  productKeys: string[],
  query: string,
  lang = "en",
  start = 0,
  limit = 10
): Promise<SearchResponse> {
  const products = encodeURIComponent(productKeys.join(","));
  const url = `${API_BASE}/search?query=${encodeURIComponent(query)}&lang=${lang}&start=${start}&limit=${limit}&products=${products}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SearchResponse>;
}

/**
 * 구성 제품 전체의 TOC를 병렬 조회한다.
 * 제품이 여럿이면 일부가 실패해도 나머지는 반환한다.
 * 제품이 하나뿐이면 실패를 그대로 던져서 호출부가 에러로 처리하게 한다.
 */
export async function fetchToc(
  components: { key: string; label: string }[],
  lang = "en"
): Promise<ComponentToc[]> {
  const single = components.length === 1;

  return Promise.all(
    components.map(async ({ key, label }) => {
      try {
        const res = await fetch(`${API_BASE}/toc/${key}?lang=${lang}`, { headers });
        if (!res.ok) {
          if (single) {
            throw new Error(`TOC fetch failed: ${res.status} ${res.statusText}`);
          }
          return { key, label, error: `${res.status} ${res.statusText}` };
        }
        return { key, label, toc: (await res.json()) as TocResponse };
      } catch (e) {
        if (single) throw e;
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
