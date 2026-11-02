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
  wminfra: {
    id: "wminfra",
    serverName: "wminfra-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Infrastructure 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Infrastructure 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/wm-infrastructure/12.1.0
    components: [
      { key: "SSDZDB_12.1.0", label: "IBM webMethods Infrastructure" },
    ],
    search: {
      toolName: "search_wminfra_docs",
      description:
        "Search IBM webMethods Infrastructure 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'installation', 'configuration', 'runtime', 'clustering')",
    },
    read: {
      toolName: "read_wminfra_doc",
      description:
        "Read a specific IBM webMethods Infrastructure 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSDZDB_12.1.0/...')",
    },
    toc: {
      toolName: "get_wminfra_toc",
      description:
        "Get the table of contents for IBM webMethods Infrastructure 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Administering', 'Configuring')",
    },
  },

  wminstaller: {
    id: "wminstaller",
    serverName: "wminstaller-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Installer 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Installer 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/webmethods-installer/12.1.0
    components: [
      { key: "SSE9VGQ_12.1.0", label: "IBM webMethods Installer" },
    ],
    search: {
      toolName: "search_wminstaller_docs",
      description:
        "Search IBM webMethods Installer 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'install', 'upgrade', 'patch', 'silent installation')",
    },
    read: {
      toolName: "read_wminstaller_doc",
      description:
        "Read a specific IBM webMethods Installer 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSE9VGQ_12.1.0/...')",
    },
    toc: {
      toolName: "get_wminstaller_toc",
      description:
        "Get the table of contents for IBM webMethods Installer 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Upgrading', 'Uninstalling')",
    },
  },

  wmdesigner: {
    id: "wmdesigner",
    serverName: "wmdesigner-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Designer 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Designer 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/wm-designer/12.1.0
    components: [
      { key: "SSFTR88_12.1.0", label: "IBM webMethods Designer" },
    ],
    search: {
      toolName: "search_wmdesigner_docs",
      description:
        "Search IBM webMethods Designer 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'flow service', 'service editor', 'debugging', 'palette')",
    },
    read: {
      toolName: "read_wmdesigner_doc",
      description:
        "Read a specific IBM webMethods Designer 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSFTR88_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmdesigner_toc",
      description:
        "Get the table of contents for IBM webMethods Designer 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Getting Started', 'Developing', 'Debugging')",
    },
  },

  wmis: {
    id: "wmis",
    serverName: "wmis-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Integration Server 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Integration Server 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/wm-integration-server/12.1.0
    components: [
      { key: "SSL8N8_12.1.0", label: "IBM webMethods Integration Server" },
    ],
    search: {
      toolName: "search_wmis_docs",
      description:
        "Search IBM webMethods Integration Server (IS) 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'flow service', 'adapter', 'trigger', 'JDBC', 'REST API')",
    },
    read: {
      toolName: "read_wmis_doc",
      description:
        "Read a specific IBM webMethods Integration Server 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSL8N8_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmis_toc",
      description:
        "Get the table of contents for IBM webMethods Integration Server 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Administering', 'Developing', 'Security')",
    },
  },

  wmmsr: {
    id: "wmmsr",
    serverName: "wmmsr-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Microservices Runtime 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Microservices Runtime 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/wm-microservices-runtime/12.1.0
    components: [
      { key: "SSIL0VK_12.1.0", label: "IBM webMethods Microservices Runtime" },
    ],
    search: {
      toolName: "search_wmmsr_docs",
      description:
        "Search IBM webMethods Microservices Runtime (MSR) 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'microservice', 'container', 'Docker', 'Kubernetes', 'REST')",
    },
    read: {
      toolName: "read_wmmsr_doc",
      description:
        "Read a specific IBM webMethods Microservices Runtime 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSIL0VK_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmmsr_toc",
      description:
        "Get the table of contents for IBM webMethods Microservices Runtime 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Deploying', 'Administering')",
    },
  },

  wmcloudstreams: {
    id: "wmcloudstreams",
    serverName: "wmcloudstreams-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods CloudStreams 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods CloudStreams 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/webmethods-cloudstreams/12.1.0
    components: [
      { key: "SSMAZ29_12.1.0", label: "IBM webMethods CloudStreams" },
    ],
    search: {
      toolName: "search_wmcloudstreams_docs",
      description:
        "Search IBM webMethods CloudStreams 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'cloud connector', 'SaaS', 'OAuth', 'provider', 'virtual service')",
    },
    read: {
      toolName: "read_wmcloudstreams_doc",
      description:
        "Read a specific IBM webMethods CloudStreams 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSMAZ29_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmcloudstreams_toc",
      description:
        "Get the table of contents for IBM webMethods CloudStreams 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Getting Started', 'Administering', 'Developing')",
    },
  },

  wmum: {
    id: "wmum",
    serverName: "wmum-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Universal Messaging 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Universal Messaging 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/wm-universal-messaging/12.1.0
    components: [
      { key: "SSEUZ5Z_12.1.0", label: "IBM webMethods Universal Messaging" },
    ],
    search: {
      toolName: "search_wmum_docs",
      description:
        "Search IBM webMethods Universal Messaging (UM) 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'messaging', 'channel', 'queue', 'publish subscribe', 'realm server')",
    },
    read: {
      toolName: "read_wmum_doc",
      description:
        "Read a specific IBM webMethods Universal Messaging 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSEUZ5Z_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmum_toc",
      description:
        "Get the table of contents for IBM webMethods Universal Messaging 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Administering', 'Developing')",
    },
  },

  wmbroker: {
    id: "wmbroker",
    serverName: "wmbroker-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Broker 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Broker 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-integration/webmethods-broker/12.1.0
    components: [
      { key: "SSHB271_12.1.0", label: "IBM webMethods Broker" },
    ],
    search: {
      toolName: "search_wmbroker_docs",
      description:
        "Search IBM webMethods Broker 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'broker', 'document type', 'client group', 'territory', 'publish subscribe')",
    },
    read: {
      toolName: "read_wmbroker_doc",
      description:
        "Read a specific IBM webMethods Broker 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSHB271_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmbroker_toc",
      description:
        "Get the table of contents for IBM webMethods Broker 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Administering', 'Developing')",
    },
  },
  wmmywebmethods: {
    id: "wmmywebmethods",
    serverName: "wmmywebmethods-docs",
    version: "1.0.0",
    startupMessage:
      "IBM My webMethods Server 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM My webMethods Server 12.1.0",
    // https://www.ibm.com/docs/en/my-webmethods-server/12.1.0
    components: [
      { key: "SSJ2E9_12.1.0", label: "IBM My webMethods Server" },
    ],
    search: {
      toolName: "search_wmmywebmethods_docs",
      description:
        "Search IBM My webMethods Server 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'portal', 'task', 'dashboard', 'business process', 'user management')",
    },
    read: {
      toolName: "read_wmmywebmethods_doc",
      description:
        "Read a specific IBM My webMethods Server 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSJ2E9_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmmywebmethods_toc",
      description:
        "Get the table of contents for IBM My webMethods Server 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Administering', 'Developing', 'Using')",
    },
  },

  wmmonitor: {
    id: "wmmonitor",
    serverName: "wmmonitor-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Monitor 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Monitor 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-monitor/12.1.0
    components: [
      { key: "SSNGGZ_12.1.0", label: "IBM webMethods Monitor" },
    ],
    search: {
      toolName: "search_wmmonitor_docs",
      description:
        "Search IBM webMethods Monitor 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'monitoring', 'process', 'service', 'log', 'alert')",
    },
    read: {
      toolName: "read_wmmonitor_doc",
      description:
        "Read a specific IBM webMethods Monitor 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSNGGZ_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmmonitor_toc",
      description:
        "Get the table of contents for IBM webMethods Monitor 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Administering', 'Monitoring', 'Configuring')",
    },
  },

  wmupdatemgr: {
    id: "wmupdatemgr",
    serverName: "wmupdatemgr-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Update Manager 12.0.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Update Manager 12.0.0",
    // https://www.ibm.com/docs/en/webmethods-update-manager/12.0.0
    components: [
      { key: "SSMXB5L_12.0.0", label: "IBM webMethods Update Manager" },
    ],
    search: {
      toolName: "search_wmupdatemgr_docs",
      description:
        "Search IBM webMethods Update Manager 12.0.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'update', 'patch', 'fix', 'rollback', 'release')",
    },
    read: {
      toolName: "read_wmupdatemgr_doc",
      description:
        "Read a specific IBM webMethods Update Manager 12.0.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSMXB5L_12.0.0/...')",
    },
    toc: {
      toolName: "get_wmupdatemgr_toc",
      description:
        "Get the table of contents for IBM webMethods Update Manager 12.0.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Updating', 'Uninstalling')",
    },
  },

  wmadapters: {
    id: "wmadapters",
    serverName: "wmadapters-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Adapters Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Adapters",
    // https://www.ibm.com/docs/en/webmethods-adapters
    components: [
      { key: "SSUKUZG", label: "IBM webMethods Adapters" },
    ],
    search: {
      toolName: "search_wmadapters_docs",
      description:
        "Search IBM webMethods Adapters documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'adapter', 'JDBC', 'SAP', 'Salesforce', 'connection')",
    },
    read: {
      toolName: "read_wmadapters_doc",
      description:
        "Read a specific IBM webMethods Adapters documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSUKUZG/...')",
    },
    toc: {
      toolName: "get_wmadapters_toc",
      description:
        "Get the table of contents for IBM webMethods Adapters documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Configuring', 'Using')",
    },
  },

  wmdeployer: {
    id: "wmdeployer",
    serverName: "wmdeployer-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Deployer 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Deployer 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-deployer/12.1.0
    components: [
      { key: "SST24G_12.1.0", label: "IBM webMethods Deployer" },
    ],
    search: {
      toolName: "search_wmdeployer_docs",
      description:
        "Search IBM webMethods Deployer 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'deployment', 'project', 'candidate', 'repository', 'automation')",
    },
    read: {
      toolName: "read_wmdeployer_doc",
      description:
        "Read a specific IBM webMethods Deployer 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SST24G_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmdeployer_toc",
      description:
        "Get the table of contents for IBM webMethods Deployer 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Deploying', 'Administering')",
    },
  },

  wmcommandcentral: {
    id: "wmcommandcentral",
    serverName: "wmcommandcentral-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Command Central 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Command Central 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-command-central/12.1.0
    components: [
      { key: "SSAQYBR_12.1.0", label: "IBM webMethods Command Central" },
    ],
    search: {
      toolName: "search_wmcommandcentral_docs",
      description:
        "Search IBM webMethods Command Central 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'command central', 'platform manager', 'template', 'provisioning', 'lifecycle')",
    },
    read: {
      toolName: "read_wmcommandcentral_doc",
      description:
        "Read a specific IBM webMethods Command Central 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSAQYBR_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmcommandcentral_toc",
      description:
        "Get the table of contents for IBM webMethods Command Central 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Administering', 'Provisioning')",
    },
  },

  bigmemorymax: {
    id: "bigmemorymax",
    serverName: "bigmemorymax-docs",
    version: "1.0.0",
    startupMessage:
      "IBM BigMemory Max 4.5.1 Docs MCP server running on stdio",
    tocHeading: "IBM BigMemory Max 4.5.1",
    // https://www.ibm.com/docs/en/bigmemory-max/4.5.1
    components: [
      { key: "SSMGFCH_4.5.1", label: "IBM BigMemory Max" },
    ],
    search: {
      toolName: "search_bigmemorymax_docs",
      description:
        "Search IBM BigMemory Max 4.5.1 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'in-memory', 'cache', 'Ehcache', 'distributed', 'BigMemory')",
    },
    read: {
      toolName: "read_bigmemorymax_doc",
      description:
        "Read a specific IBM BigMemory Max 4.5.1 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSMGFCH_4.5.1/...')",
    },
    toc: {
      toolName: "get_bigmemorymax_toc",
      description:
        "Get the table of contents for IBM BigMemory Max 4.5.1 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Administering', 'Configuring')",
    },
  },

  terracotta: {
    id: "terracotta",
    serverName: "terracotta-docs",
    version: "1.0.0",
    startupMessage:
      "IBM Terracotta 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM Terracotta 12.1.0",
    // https://www.ibm.com/docs/en/terracotta/12.1.0
    components: [
      { key: "SSJ67XW_12.1.0", label: "IBM Terracotta" },
    ],
    search: {
      toolName: "search_terracotta_docs",
      description:
        "Search IBM Terracotta 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'clustering', 'distributed cache', 'server', 'Ehcache', 'session')",
    },
    read: {
      toolName: "read_terracotta_doc",
      description:
        "Read a specific IBM Terracotta 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSJ67XW_12.1.0/...')",
    },
    toc: {
      toolName: "get_terracotta_toc",
      description:
        "Get the table of contents for IBM Terracotta 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Administering', 'Configuring')",
    },
  },

  wmb2btrading: {
    id: "wmb2btrading",
    serverName: "wmb2btrading-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods B2B Trading Networks 12.1.0 Docs MCP server running on stdio",
    tocHeading: "IBM webMethods B2B Trading Networks 12.1.0",
    // https://www.ibm.com/docs/en/webmethods-b2b-trading-networks/12.1.0
    components: [
      { key: "SSYDXW_12.1.0", label: "IBM webMethods B2B Trading Networks" },
    ],
    search: {
      toolName: "search_wmb2btrading_docs",
      description:
        "Search IBM webMethods B2B Trading Networks 12.1.0 documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'trading partner', 'EDI', 'B2B', 'document exchange', 'routing')",
    },
    read: {
      toolName: "read_wmb2btrading_doc",
      description:
        "Read a specific IBM webMethods B2B Trading Networks 12.1.0 documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSYDXW_12.1.0/...')",
    },
    toc: {
      toolName: "get_wmb2btrading_toc",
      description:
        "Get the table of contents for IBM webMethods B2B Trading Networks 12.1.0 documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Administering', 'Developing', 'Using')",
    },
  },

  wmestandards: {
    id: "wmestandards",
    serverName: "wmestandards-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods eStandards Docs MCP server running on stdio",
    tocHeading: "IBM webMethods eStandards",
    // https://www.ibm.com/docs/en/webmethods-estandards
    components: [
      { key: "SSQX2X8", label: "IBM webMethods eStandards" },
    ],
    search: {
      toolName: "search_wmestandards_docs",
      description:
        "Search IBM webMethods eStandards documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'EDI', 'EDIFACT', 'X12', 'HL7', 'RosettaNet', 'schema')",
    },
    read: {
      toolName: "read_wmestandards_doc",
      description:
        "Read a specific IBM webMethods eStandards documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSQX2X8/...')",
    },
    toc: {
      toolName: "get_wmestandards_toc",
      description:
        "Get the table of contents for IBM webMethods eStandards documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Installing', 'Configuring', 'Using')",
    },
  },

  wmpkgregistry: {
    id: "wmpkgregistry",
    serverName: "wmpkgregistry-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods Package Registry (SaaS) Docs MCP server running on stdio",
    tocHeading: "IBM webMethods Package Registry (SaaS)",
    // https://www.ibm.com/docs/en/webmethods-package-registry
    components: [
      { key: "SSYVSL1", label: "IBM webMethods Package Registry" },
    ],
    search: {
      toolName: "search_wmpkgregistry_docs",
      description:
        "Search IBM webMethods Package Registry (SaaS) documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'package', 'registry', 'publish', 'artifact', 'SaaS')",
    },
    read: {
      toolName: "read_wmpkgregistry_doc",
      description:
        "Read a specific IBM webMethods Package Registry (SaaS) documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSYVSL1/...')",
    },
    toc: {
      toolName: "get_wmpkgregistry_toc",
      description:
        "Get the table of contents for IBM webMethods Package Registry (SaaS) documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Getting Started', 'Administering', 'Using')",
    },
  },

  wme2emonitoring: {
    id: "wme2emonitoring",
    serverName: "wme2emonitoring-docs",
    version: "1.0.0",
    startupMessage:
      "IBM webMethods End-to-End Monitoring (SaaS) Docs MCP server running on stdio",
    tocHeading: "IBM webMethods End-to-End Monitoring (SaaS)",
    // https://www.ibm.com/docs/en/webmethods-end-to-end-monitoring
    components: [
      { key: "SSMIVP", label: "IBM webMethods End-to-End Monitoring" },
    ],
    search: {
      toolName: "search_wme2emonitoring_docs",
      description:
        "Search IBM webMethods End-to-End Monitoring (SaaS) documentation. Returns matching topics with titles, snippets, and URLs.",
      queryHint:
        "Search query (e.g. 'monitoring', 'dashboard', 'transaction', 'alert', 'SaaS')",
    },
    read: {
      toolName: "read_wme2emonitoring_doc",
      description:
        "Read a specific IBM webMethods End-to-End Monitoring (SaaS) documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
      hrefHint:
        "Document href path (e.g. 'SSMIVP/...')",
    },
    toc: {
      toolName: "get_wme2emonitoring_toc",
      description:
        "Get the table of contents for IBM webMethods End-to-End Monitoring (SaaS) documentation. Shows the full document structure with sections and topics.",
      sectionHint:
        "Optional: filter to a specific section by label (e.g. 'Getting Started', 'Administering', 'Using')",
    },
  },
} satisfies Record<string, ProductDefinition>;

export type ProductId = keyof typeof PRODUCTS;
