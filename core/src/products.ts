// 제품 레지스트리.
//
// 서버 간에 실제로 달랐던 값은 전부 여기에 데이터로 모여 있다.
// 제품을 추가하려면 폴더를 복제하는 대신 이 파일에 한 블록을 더하고,
// <제품>-docs-mcp/src/index.ts 3줄짜리 엔트리만 만들면 된다.

export interface ProductComponent {
  key: string;
  label: string;
}

export interface ProductDefinition {
  /** 레지스트리 키. */
  id: string;
  /** MCP serverInfo.name. */
  serverName: string;
  version: string;
  /** 기동 시 stderr 에 찍는 문구. */
  startupMessage: string;
  /** get_*_toc 응답의 최상단 제목. */
  tocHeading: string;
  /**
   * IBM Docs 제품 키. 2개 이상이면 구성 제품별 그룹핑 모드가 되어
   * TOC 에 `product` 필터가 붙고 제품별 블록으로 렌더링된다.
   */
  components: ProductComponent[];
  /** 지정하면 lang 파라미터를 노출한다. 없으면 영어 고정. */
  langs?: readonly ["ko", "en"];
  search: { toolName: string; description: string; queryHint: string };
  read: { toolName: string; description: string; hrefHint: string };
  toc: {
    toolName: string;
    description: string;
    sectionHint: string;
    /** 그룹핑 모드에서만 노출되는 product 파라미터 설명. */
    productHint?: string;
    /** 그룹핑 모드 안내 문구에 넣을 예시 제품명. */
    productExample?: string;
  };
}

export const PRODUCTS = {
  activetransfer: {
    id: "activetransfer",
    serverName: "activetransfer-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods ActiveTransfer Docs MCP server running on stdio",
    tocHeading: "IBM webMethods ActiveTransfer 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-activetransfer/12.1.0
    components: [
      { key: "SSIGL3H_12.1.0", label: "IBM webMethods ActiveTransfer" },
    ],
    search: {
      toolName: "search_activetransfer_docs",
      description:
        "Search IBM webMethods ActiveTransfer 12.1.0 documentation (managed file transfer: Server, Gateway, Agent). Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'listener', 'virtual folder', 'scheduled transfer', 'SFTP')",
    },
    read: {
      toolName: "read_activetransfer_doc",
      description:
        "Read a specific IBM webMethods ActiveTransfer documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSIGL3H_12.1.0/co-listeners.html', 'SSIGL3H_12.1.0/ta-adding_folders.html')",
    },
    toc: {
      toolName: "get_activetransfer_toc",
      description:
        "Get the table of contents for IBM webMethods ActiveTransfer 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Using ActiveTransfer', 'Administering ActiveTransfer Server', 'Administering ActiveTransfer Gateway')",
    },
  },

  apic: {
    id: "apic",
    serverName: "apic-docs",
    version: "1.0.0",
    startupMessage: "APIC Docs MCP server running on stdio",
    tocHeading: "IBM API Connect 12.1.0",
    components: [{ key: "SSMNED_12.1.x_cd", label: "IBM API Connect" }],
    search: {
      toolName: "search_apic_docs",
      description:
        "Search IBM API Connect 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint: "Search query (e.g. 'gateway', 'oauth', 'catalog')",
    },
    read: {
      toolName: "read_apic_doc",
      description:
        "Read a specific IBM API Connect documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSMNED_12.1.x_cd/com.ibm.apic.overview.doc/api_management_overview.html')",
    },
    toc: {
      toolName: "get_apic_toc",
      description:
        "Get the table of contents for IBM API Connect 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Security')",
    },
  },

  concert: {
    id: "concert",
    serverName: "concert-docs",
    version: "1.0.0",
    startupMessage: "Concert Docs MCP server running on stdio",
    tocHeading: "IBM Concert",
    components: [{ key: "SSQNYH_2.3.x", label: "IBM Concert" }],
    search: {
      toolName: "search_concert_docs",
      description:
        "Search IBM Concert documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint: "Search query (e.g. 'application', 'inventory', 'integration')",
    },
    read: {
      toolName: "read_concert_doc",
      description:
        "Read a specific IBM Concert documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint: "Document href path (e.g. 'SSQNYH_2.3.x/...')",
    },
    toc: {
      toolName: "get_concert_toc",
      description:
        "Get the table of contents for IBM Concert documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installation', 'Integrating', 'inventory')",
    },
  },

  dpgw1100: {
    id: "dpgw1100",
    serverName: "dpgw1100-docs",
    version: "1.0.0",
    startupMessage: "DataPower Gateway 11.0.0 Docs MCP server running on stdio",
    tocHeading: "IBM DataPower Gateway 11.0.0",
    // https://www.ibm.com/docs/en/datapower-gateway/11.0.0
    components: [{ key: "SS9H2Y_11.0.0", label: "IBM DataPower Gateway" }],
    search: {
      toolName: "search_dpgw1100_docs",
      description:
        "Search IBM DataPower Gateway 11.0.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint: "Search query (e.g. 'gateway', 'oauth', 'catalog')",
    },
    read: {
      toolName: "read_dpgw1100_doc",
      description:
        "Read a specific IBM DataPower Gateway 11.0.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SS9H2Y_11.0.0/apigw/gatewaypeering.html', 'SS9H2Y_11.0.0/admin/administration.html', 'SS9H2Y_11.0.0/commands/mpgw_global.html')",
    },
    toc: {
      toolName: "get_dpgw1100_toc",
      description:
        "Get the table of contents for IBM DataPower Gateway 11.0.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Security')",
    },
  },

  graphql: {
    id: "graphql",
    serverName: "graphql-docs",
    version: "1.0.0",
    startupMessage: "GraphQL Docs MCP server running on stdio",
    tocHeading: "IBM API Connect for GraphQL Software 1.1.x",
    components: [{ key: "SSMNED_ESS_1.x", label: "IBM API Connect for GraphQL" }],
    search: {
      toolName: "search_graphql_docs",
      description:
        "Search IBM API Connect for GraphQL Software 1.1.x documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint: "Search query (e.g. 'gateway', 'oauth', 'catalog')",
    },
    read: {
      toolName: "read_graphql_doc",
      description:
        "Read a specific IBM API Connect for GraphQL Software 1.1.x documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSMNED_ESS_1.x/src/graphql-basics/create-schema.html')",
    },
    toc: {
      toolName: "get_graphql_toc",
      description:
        "Get the table of contents for IBM API Connect for GraphQL Software 1.1.x documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Security')",
    },
  },

  idig: {
    id: "idig",
    serverName: "idig-docs",
    version: "1.0.0",
    startupMessage: "IDIG Docs MCP server running on stdio",
    tocHeading: "IBM DataPower Interact Gateway 12.1.1",
    // https://www.ibm.com/docs/en/dp-interact-gateway/12.1.1
    components: [
      { key: "SSP8GWM_12.1.1", label: "IBM DataPower Interact Gateway" },
    ],
    search: {
      toolName: "search_idig_docs",
      description:
        "Search IBM DataPower Interact Gateway 12.1.1 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint: "Search query (e.g. 'gateway', 'oauth', 'catalog')",
    },
    read: {
      toolName: "read_idig_doc",
      description:
        "Read a specific IBM DataPower Interact Gateway 12.1.1 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSP8GWM_12.1.1/com.ibm.dp.interact.overview.doc/gateway_overview.html')",
    },
    toc: {
      toolName: "get_idig_toc",
      description:
        "Get the table of contents for IBM DataPower Interact Gateway 12.1.1 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Security')",
    },
  },

  instana: {
    id: "instana",
    serverName: "instana-docs",
    version: "1.0.0",
    startupMessage: "Instana Docs MCP server running on stdio",
    tocHeading: "IBM Instana Observability",
    // https://www.ibm.com/docs/en/instana-observability
    // SSE1JP5 는 제품군(family) 키라 검색 필터로는 동작하지만 자체 문서 세트가
    // 없어 TOC·content 조회는 404 다. 실제 문서는 에디션별로 나뉘어 있으므로
    // 에디션 키를 직접 지정한다. 자체 호스팅 두 에디션은 최신 버전만 포함한다
    // (1.0.317/319/321 은 검색 중복을 피해 제외).
    components: [
      { key: "SSO4JPD", label: "Instana SaaS" },
      { key: "SSZMH3N_1.0.323", label: "Self-Hosted Standard Edition" },
      { key: "SSV8Z4_1.0.323", label: "Self-Hosted Custom Edition" },
    ],
    search: {
      toolName: "search_instana_docs",
      description:
        "Search IBM Instana Observability documentation across all editions: SaaS, Self-Hosted Standard Edition, and Self-Hosted Custom Edition. Returns matching topics with titles, snippets, and URLs.",
      queryHint: "Search query (e.g. 'monitoring', 'kubernetes', 'alerting')",
    },
    read: {
      toolName: "read_instana_doc",
      description:
        "Read a specific IBM Instana documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path, starting with the edition product key (e.g. 'SSO4JPD/src/pages/releases/what-s-new.html', 'SSZMH3N_1.0.323/src/pages/ecosystem/kubernetes/index.html')",
    },
    toc: {
      toolName: "get_instana_toc",
      description:
        "Get the table of contents for IBM Instana Observability documentation, grouped by edition. Use 'product' to narrow to one edition and 'section' to filter sections by label.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Monitoring', 'Alerting')",
      productHint:
        "Optional: filter to one edition by name or key (e.g. 'Instana SaaS', 'Self-Hosted Standard Edition', 'SSO4JPD')",
      productExample: "Instana SaaS",
    },
  },

  iwhi: {
    id: "iwhi",
    serverName: "iwhi-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Hybrid Integration Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Hybrid Integration",
    // 단일 제품이 아니라 구성 제품별로 문서가 나뉘어 있어 전체를 묶어서 조회한다.
    // 각 제품의 최신 버전만 포함한다 (레거시 SSFQ7G1_10.0.x 는 검색 중복을 피해 제외).
    components: [
      { key: "SSC74RW_saas", label: "Hybrid Integration SaaS" },
      { key: "SSGOVO", label: "webMethods Integration" },
      { key: "SSJ8I7", label: "App Connect" },
      { key: "SSFQ7G1_12.1.0", label: "API Connect" },
      { key: "SSMQ84", label: "webMethods B2B Integration" },
      { key: "SSXAAZY", label: "webMethods API Gateway" },
      { key: "SSMBFW", label: "Event Endpoint Management" },
      { key: "SSO4MT7", label: "webMethods Developer Portal" },
      { key: "SSS4PI", label: "API Connect for GraphQL" },
    ],
    langs: ["ko", "en"],
    search: {
      toolName: "search_iwhi_docs",
      description:
        "Search IBM webMethods Hybrid Integration (IWHI) documentation across all component products: webMethods Integration, App Connect, API Connect, B2B Integration, API Gateway, Event Endpoint Management, Developer Portal, and API Connect for GraphQL. Returns matching topics with titles, snippets, and URLs.",
      queryHint: "Search query (e.g. 'API gateway', 'flow service', 'connector')",
    },
    read: {
      toolName: "read_iwhi_doc",
      description:
        "Read a specific IBM webMethods Hybrid Integration documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path, starting with the component product key (e.g. 'SSGOVO/...', 'SSJ8I7/...', 'SSXAAZY/...')",
    },
    toc: {
      toolName: "get_iwhi_toc",
      description:
        "Get the table of contents for IBM webMethods Hybrid Integration documentation, grouped by component product. Use 'product' to narrow to one component and 'section' to filter sections by label.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Security', 'Administering')",
      productHint:
        "Optional: filter to one component product by name or key (e.g. 'App Connect', 'API Gateway', 'SSGOVO')",
      productExample: "App Connect",
    },
  },
} satisfies Record<string, ProductDefinition>;

export type ProductId = keyof typeof PRODUCTS;
