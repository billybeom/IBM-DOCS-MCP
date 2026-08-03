# concert-docs-mcp

> **Unofficial** - IBM과 공식적으로 관련 없는 커뮤니티 프로젝트입니다.

IBM Concert 공식 문서를 검색하고 조회할 수 있는 비공식 MCP(Model Context Protocol) 서버입니다.

## Tools

| Tool | Description |
|------|-------------|
| `search_concert_docs` | 키워드로 문서 검색 (290+ 문서, 페이지네이션 지원) |
| `read_concert_doc` | 특정 문서 페이지를 Markdown으로 조회 |
| `get_concert_toc` | 전체 목차(TOC) 구조 조회 (섹션 필터 가능) |

## Setup

```bash
git clone https://github.com/billybeom/IBM-DOCS-MCP.git
cd IBM-DOCS-MCP/concert-docs-mcp
npm install
npm run build
```

### IBM Bob

전역 설정(`~/.bob/mcp_settings.json`) 또는 프로젝트 설정(`.bob/mcp.json`)에 추가:

```json
{
  "mcpServers": {
    "concert-docs": {
      "command": "node",
      "args": ["/absolute/path/to/concert-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_concert_docs", "read_concert_doc", "get_concert_toc"]
    }
  }
}
```

### Claude Code

**방법 1: CLI 명령어** (권장)

```bash
claude mcp add concert-docs -- node /absolute/path/to/concert-docs-mcp/dist/index.js
```

**방법 2: `.mcp.json`** (프로젝트 루트에 생성, 팀 공유용)

```json
{
  "mcpServers": {
    "concert-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/concert-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "concert-docs": {
      "command": "node",
      "args": ["/absolute/path/to/concert-docs-mcp/dist/index.js"]
    }
  }
}
```

> `alwaysAllow`를 설정하면 도구 사용 시 매번 승인하지 않아도 됩니다.

## Usage Examples

```
"application 정의 업데이트 방법 알려줘"
"inventory 관련 문서 찾아줘"
"설치 관련 목차 보여줘"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` - MCP 프로토콜 구현
- `jsdom` + `turndown` - HTML to Markdown 변환
- IBM Docs API (`ibm.com/docs/api/v1`) - 문서 검색 및 조회

## License

MIT
