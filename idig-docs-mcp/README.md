# idig-docs-mcp

> **Unofficial** - IBM과 공식적으로 관련 없는 커뮤니티 프로젝트입니다.

IBM DataPower Interact Gateway 12.1.1 공식 문서를 검색하고 조회할 수 있는 비공식 MCP(Model Context Protocol) 서버입니다.

Claude Code, Claude Desktop, IBM Bob 등 MCP를 지원하는 AI 클라이언트에서 사용할 수 있습니다.

## Tools

| Tool | Description |
|------|-------------|
| `search_idig_docs` | 키워드로 문서 검색 (1,000+ 문서, 페이지네이션 지원) |
| `read_idig_doc` | 특정 문서 페이지를 Markdown으로 조회 |
| `get_idig_toc` | 전체 목차(TOC) 구조 조회 (섹션 필터 가능) |

## Setup

이 저장소는 npm workspaces 단일 트리입니다. **루트에서 한 번** 설치/빌드하면 모든 서버가 함께 빌드됩니다.

```bash
git clone https://github.com/billybeom/IBM-DOCS-MCP.git
cd IBM-DOCS-MCP
npm install
npm run build
```

빌드 결과 경로는 종전과 같은 `idig-docs-mcp/dist/index.js` 입니다.
이 서버만 빌드하려면 `cd idig-docs-mcp && npm run build` 도 됩니다 (공용 코어가 먼저 빌드됩니다).

### IBM Bob

전역 설정(`~/.bob/mcp_settings.json`) 또는 프로젝트 설정(`.bob/mcp.json`)에 추가:

```json
{
  "mcpServers": {
    "idig-docs": {
      "command": "node",
      "args": ["/absolute/path/to/idig-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_idig_docs", "read_idig_doc", "get_idig_toc"]
    }
  }
}
```

### Claude Code

**방법 1: CLI 명령어** (권장)

```bash
claude mcp add idig-docs -- node /absolute/path/to/idig-docs-mcp/dist/index.js
```

**방법 2: `.mcp.json`** (프로젝트 루트에 생성, 팀 공유용)

```json
{
  "mcpServers": {
    "idig-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/idig-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "idig-docs": {
      "command": "node",
      "args": ["/absolute/path/to/idig-docs-mcp/dist/index.js"]
    }
  }
}
```

> `alwaysAllow`를 설정하면 도구 사용 시 매번 승인하지 않아도 됩니다.

## Usage Examples

```
"API Connect에서 OAuth 설정하는 방법 알려줘"
"gateway endpoint 관련 문서 찾아줘"
"설치 관련 목차 보여줘"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` - MCP 프로토콜 구현
- `jsdom` + `turndown` - HTML to Markdown 변환
- IBM Docs API (`ibm.com/docs/api/v1`) - 문서 검색 및 조회

## License

MIT
