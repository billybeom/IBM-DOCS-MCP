# instana-docs-mcp

> **Unofficial** - IBM과 공식적으로 관련 없는 커뮤니티 프로젝트입니다.

IBM Instana Observability 공식 문서를 검색하고 조회할 수 있는 비공식 MCP(Model Context Protocol) 서버입니다.

## Tools

| Tool | Description |
|------|-------------|
| `search_instana_docs` | 키워드로 문서 검색 (에디션 전체 대상, 페이지네이션 지원) |
| `read_instana_doc` | 특정 문서 페이지를 Markdown으로 조회 |
| `get_instana_toc` | 목차(TOC) 조회 — 에디션별로 그룹핑. `product`/`section` 필터 지원 |

### 대상 에디션

Instana 문서는 제품군 키(`SSE1JP5`) 하나로 묶여 있지만 실제 문서 세트는 아래 3개
에디션으로 나뉘어 있으며, 이 서버는 전체를 한 번에 검색합니다.
(`SSE1JP5` 자체는 검색 필터로만 동작하고 TOC·content 조회는 404 이므로 쓰지 않습니다.)

| Product key | Edition |
|---|---|
| `SSO4JPD` | Instana SaaS |
| `SSZMH3N_1.0.323` | Self-Hosted Standard Edition |
| `SSV8Z4_1.0.323` | Self-Hosted Custom Edition |

자체 호스팅 에디션은 최신 버전만 포함합니다 (이전 버전 `1.0.317`/`1.0.319`/`1.0.321`
은 검색 결과 중복을 피해 제외).

## Setup

이 저장소는 npm workspaces 단일 트리입니다. **루트에서 한 번** 설치/빌드하면 모든 서버가 함께 빌드됩니다.

```bash
git clone https://github.com/billybeom/IBM-DOCS-MCP.git
cd IBM-DOCS-MCP
npm install
npm run build
```

빌드 결과 경로는 종전과 같은 `instana-docs-mcp/dist/index.js` 입니다.
이 서버만 빌드하려면 `cd instana-docs-mcp && npm run build` 도 됩니다 (공용 코어가 먼저 빌드됩니다).

### IBM Bob

전역 설정(`~/.bob/mcp_settings.json`) 또는 프로젝트 설정(`.bob/mcp.json`)에 추가:

```json
{
  "mcpServers": {
    "instana-docs": {
      "command": "node",
      "args": ["/absolute/path/to/instana-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_instana_docs", "read_instana_doc", "get_instana_toc"]
    }
  }
}
```

### Claude Code

**방법 1: CLI 명령어** (권장)

```bash
claude mcp add instana-docs -- node /absolute/path/to/instana-docs-mcp/dist/index.js
```

**방법 2: `.mcp.json`** (프로젝트 루트에 생성, 팀 공유용)

```json
{
  "mcpServers": {
    "instana-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/instana-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "instana-docs": {
      "command": "node",
      "args": ["/absolute/path/to/instana-docs-mcp/dist/index.js"]
    }
  }
}
```

> `alwaysAllow`를 설정하면 도구 사용 시 매번 승인하지 않아도 됩니다.

## Usage Examples

```
"Kubernetes 모니터링 설정 방법 알려줘"
"alerting 관련 문서 찾아줘"
"설치 관련 목차 보여줘"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` - MCP 프로토콜 구현
- `jsdom` + `turndown` - HTML to Markdown 변환
- IBM Docs API (`ibm.com/docs/api/v1`) - 문서 검색 및 조회

## License

MIT
