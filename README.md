# ibm-docs-mcp

https://github.com/Aiden-Kwak/IBM-DOCS-MCP 레파지토리 포크해서 개인적으로 필요한 IBM 제품 Document 추가합니다.
- IBM DataPower Interact Gateway 12.1.1
- IBM API Connect for GraphQL Software 1.1.x

> **Unofficial** - IBM과 공식적으로 관련 없는 커뮤니티 프로젝트입니다.

IBM 제품 공식 문서를 검색하고 조회할 수 있는 비공식 MCP(Model Context Protocol) 서버 모음입니다.

IBM Bob, Claude Code, Claude Desktop 등 MCP를 지원하는 AI 클라이언트에서 사용할 수 있습니다.

## MCP Servers

| Server | Product | Docs | Tools |
|--------|---------|------|-------|
| [apic-docs-mcp](./apic-docs-mcp) | IBM API Connect 12.1.1 | 1,000+ | `search_apic_docs`, `read_apic_doc`, `get_apic_toc` |
| [idig-docs-mcp](./idig-docs-mcp) | IBM DataPower Interact Gateway 12.1.1 | ??? | `search_idig_docs`, `read_idig_doc`, `get_idig_toc` |
| [graphql-docs-mcp](./graphql-docs-mcp) | IBM API Connect for GraphQL Software 1.1.x | ??? | `search_graphql_docs`, `read_graphql_doc`, `get_graphql_toc` |
| [iwhi-docs-mcp](./iwhi-docs-mcp) | IBM Hybrid Integration Library | 700+ | `search_iwhi_docs`, `read_iwhi_doc`, `get_iwhi_toc` |
| [instana-docs-mcp](./instana-docs-mcp) | IBM Instana Observability | 760+ | `search_instana_docs`, `read_instana_doc`, `get_instana_toc` |
| [concert-docs-mcp](./concert-docs-mcp) | IBM Concert 2.3.x | 290+ | `search_concert_docs`, `read_concert_doc`, `get_concert_toc` |

각 서버는 3가지 공통 도구를 제공합니다:
- **search** - 키워드로 문서 검색 (페이지네이션 지원)
- **read** - 특정 문서 페이지를 Markdown으로 조회
- **toc** - 전체 목차(TOC) 구조 조회 (섹션 필터 가능)

## Quick Start

```bash
# 원하는 서버 디렉토리로 이동
cd apic-docs-mcp  # 또는 idig-docs-mcp, graphql-docs-mcp, iwhi-docs-mcp, instana-docs-mcp, concert-docs-mcp

# 설치 및 빌드
npm install
npm run build
```

## Configuration

### IBM Bob

전역 설정(`~/.bob/mcp_settings.json`) 또는 프로젝트 설정(`.bob/mcp.json`)에 추가:

```json
{
  "mcpServers": {
    "apic-docs": {
      "command": "node",
      "args": ["/absolute/path/to/apic-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_apic_docs", "read_apic_doc", "get_apic_toc"]
    }
  }
}
```

### Claude Code

**방법 1: CLI 명령어** (권장)

```bash
claude mcp add apic-docs -- node /absolute/path/to/apic-docs-mcp/dist/index.js
```

**방법 2: `.mcp.json`** (프로젝트 루트에 생성, 팀 공유용)

```json
{
  "mcpServers": {
    "apic-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/apic-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "apic-docs": {
      "command": "node",
      "args": ["/absolute/path/to/apic-docs-mcp/dist/index.js"]
    }
  }
}
```

> 여러 서버를 동시에 사용하려면 `mcpServers` 안에 서버를 추가하면 됩니다.
> `alwaysAllow`를 설정하면 도구 사용 시 매번 승인하지 않아도 됩니다.
> `.mcp.json`의 환경변수는 `${VAR:-default}` 문법을 지원합니다.

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` - MCP 프로토콜 구현
- `jsdom` + `turndown` - HTML to Markdown 변환
- IBM Docs API (`ibm.com/docs/api/v1`) - 문서 검색 및 조회

## License

MIT
