# iwhi-docs-mcp

> **Unofficial** - IBM과 공식적으로 관련 없는 커뮤니티 프로젝트입니다.

IBM webMethods Hybrid Integration (IWHI) 공식 문서를 검색하고 조회할 수 있는 비공식 MCP(Model Context Protocol) 서버입니다.

한국어/영어 문서 모두 지원합니다. (검색 기본값은 `en` — 한국어 색인이 더 좁아서 영어 질의 시 결과가 크게 줄어듭니다)

## Tools

| Tool | Description |
|------|-------------|
| `search_iwhi_docs` | 키워드로 문서 검색 (1,200+ 문서, 구성 제품 전체 대상, 페이지네이션 지원) |
| `read_iwhi_doc` | 특정 문서 페이지를 Markdown으로 조회 |
| `get_iwhi_toc` | 목차(TOC) 조회 — 구성 제품별로 그룹핑. `product`/`section` 필터 지원 |

### 대상 구성 제품

webMethods Hybrid Integration은 단일 제품이 아니라 아래 9개로 문서가 나뉘어 있으며, 이 서버는 전체를 한 번에 검색합니다.

| Product key | Product |
|---|---|
| `SSC74RW_saas` | Hybrid Integration SaaS |
| `SSGOVO` | webMethods Integration |
| `SSJ8I7` | App Connect |
| `SSFQ7G1_12.1.0` | API Connect |
| `SSMQ84` | webMethods B2B Integration |
| `SSXAAZY` | webMethods API Gateway |
| `SSMBFW` | Event Endpoint Management |
| `SSO4MT7` | webMethods Developer Portal |
| `SSS4PI` | API Connect for GraphQL |

각 제품의 최신 버전만 포함합니다 (레거시 `SSFQ7G1_10.0.x` 는 검색 결과 중복을 피하기 위해 제외).

`get_iwhi_toc`를 필터 없이 호출하면 제품별 최상위 섹션만 보여줍니다. 전체 트리는 `product: "App Connect"` 처럼 좁혀서 조회하세요 (구성 제품 전체 트리는 400KB가 넘습니다).

`product` 는 정확 매칭을 우선합니다. `"API Connect"` 는 API Connect 하나만 반환하고, 정확히 걸리는 게 없을 때만 부분 문자열로 찾습니다 (`"gateway"` → webMethods API Gateway).

## Setup

이 저장소는 npm workspaces 단일 트리입니다. **루트에서 한 번** 설치/빌드하면 모든 서버가 함께 빌드됩니다.

```bash
git clone https://github.com/billybeom/IBM-DOCS-MCP.git
cd IBM-DOCS-MCP
npm install
npm run build
```

빌드 결과 경로는 종전과 같은 `iwhi-docs-mcp/dist/index.js` 입니다.
이 서버만 빌드하려면 `cd iwhi-docs-mcp && npm run build` 도 됩니다 (공용 코어가 먼저 빌드됩니다).

### IBM Bob

전역 설정(`~/.bob/mcp_settings.json`) 또는 프로젝트 설정(`.bob/mcp.json`)에 추가:

```json
{
  "mcpServers": {
    "iwhi-docs": {
      "command": "node",
      "args": ["/absolute/path/to/iwhi-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_iwhi_docs", "read_iwhi_doc", "get_iwhi_toc"]
    }
  }
}
```

### Claude Code

**방법 1: CLI 명령어** (권장)

```bash
claude mcp add iwhi-docs -- node /absolute/path/to/iwhi-docs-mcp/dist/index.js
```

**방법 2: `.mcp.json`** (프로젝트 루트에 생성, 팀 공유용)

```json
{
  "mcpServers": {
    "iwhi-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/iwhi-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "iwhi-docs": {
      "command": "node",
      "args": ["/absolute/path/to/iwhi-docs-mcp/dist/index.js"]
    }
  }
}
```

> `alwaysAllow`를 설정하면 도구 사용 시 매번 승인하지 않아도 됩니다.

## Usage Examples

```
"webMethods API Gateway 정책 설정 방법 알려줘"
"App Connect flow service 관련 문서 찾아줘"
"App Connect 목차 보여줘"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` - MCP 프로토콜 구현
- `jsdom` + `turndown` - HTML to Markdown 변환
- IBM Docs API (`ibm.com/docs/api/v1`) - 문서 검색 및 조회

## License

MIT
