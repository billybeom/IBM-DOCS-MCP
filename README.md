# ibm-docs-mcp

https://github.com/Aiden-Kwak/IBM-DOCS-MCP 레파지토리 포크해서 개인적으로 필요한 IBM 제품 Document 추가합니다.
- IBM DataPower Interact Gateway 12.1.1
- IBM API Connect for GraphQL Software 1.1.x
- IBM DataPower Gateway 11.0.0

> **Unofficial** - IBM과 공식적으로 관련 없는 커뮤니티 프로젝트입니다.

IBM 제품 공식 문서를 검색하고 조회할 수 있는 비공식 MCP(Model Context Protocol) 서버 모음입니다.

IBM Bob, Claude Code, Claude Desktop 등 MCP를 지원하는 AI 클라이언트에서 사용할 수 있습니다.

## MCP Servers

| Server | Product | Docs | Tools |
|--------|---------|------|-------|
| [apic-docs-mcp](./apic-docs-mcp) | IBM API Connect 12.1.x | 1,600+ | `search_apic_docs`, `read_apic_doc`, `get_apic_toc` |
| [idig-docs-mcp](./idig-docs-mcp) | IBM DataPower Interact Gateway 12.1.1 | 185+ | `search_idig_docs`, `read_idig_doc`, `get_idig_toc` |
| [dpgw-11.0.0-docs-mcp](./dpgw-11.0.0-docs-mcp) | IBM DataPower Gateway 11.0.0 | 1,600+ | `search_dpgw1100_docs`, `read_dpgw1100_doc`, `get_dpgw1100_toc` |
| [graphql-docs-mcp](./graphql-docs-mcp) | IBM API Connect for GraphQL Software 1.x | 75+ | `search_graphql_docs`, `read_graphql_doc`, `get_graphql_toc` |
| [iwhi-docs-mcp](./iwhi-docs-mcp) | IBM webMethods Hybrid Integration (구성 제품 9종) | 1,100+ | `search_iwhi_docs`, `read_iwhi_doc`, `get_iwhi_toc` |
| [instana-docs-mcp](./instana-docs-mcp) | IBM Instana Observability | 760+ | `search_instana_docs`, `read_instana_doc`, `get_instana_toc` |
| [concert-docs-mcp](./concert-docs-mcp) | IBM Concert 2.3.x | 260+ | `search_concert_docs`, `read_concert_doc`, `get_concert_toc` |

각 서버는 3가지 공통 도구를 제공합니다:
- **search** - 키워드로 문서 검색 (페이지네이션 지원)
- **read** - 특정 문서 페이지를 Markdown으로 조회
- **toc** - 전체 목차(TOC) 구조 조회 (섹션 필터 가능)

## Quick Start

npm workspaces 단일 트리입니다. **루트에서 한 번** 설치/빌드하면 7개 서버가 모두 빌드됩니다.

```bash
git clone https://github.com/billybeom/IBM-DOCS-MCP.git
cd IBM-DOCS-MCP
npm install
npm run build
```

빌드 결과는 종전과 같은 `<서버>/dist/index.js` 에 생성되므로, 기존 MCP 클라이언트 설정을 그대로 쓰면 됩니다.

| 명령 | 설명 |
|---|---|
| `npm run build` | 변경된 패키지만 증분 빌드 (`tsc -b`) |
| `npm run rebuild` | 전체 클린 후 재빌드 |
| `npm run dump-tools` | 7개 서버를 띄워 `tools/list` 결과를 JSON 으로 출력 (변경 전후 비교용) |

특정 서버 하나만 빌드하려면 `cd apic-docs-mcp && npm run build` 도 됩니다 (공용 코어가 먼저 빌드됩니다).

## 구조

서버마다 같은 코드 3파일(≈330줄)이 7벌 복제돼 있던 것을 공용 코어 하나로 합쳤습니다.
서버별로 실제 달랐던 값(제품 키, 툴 이름, 설명 문구)은 전부 레지스트리에 데이터로 모여 있습니다.

```
IBM-DOCS-MCP/
├── package.json              # workspaces 루트
├── package-lock.json         # 1개 (서버별 lock 없음)
├── core/                     # @ibm-docs-mcp/core
│   └── src/
│       ├── products.ts         # ★ 제품 레지스트리 — 서버 간 차이가 전부 여기
│       ├── ibm-docs-api.ts     # IBM Docs API 클라이언트 (검색/TOC/콘텐츠)
│       ├── utils.ts            # HTML → Markdown 변환
│       └── server.ts           # 툴 3개를 등록한 MCP 서버 생성
├── apic-docs-mcp/src/index.ts  # 엔트리 (3줄)
├── … 나머지 6개도 동일
└── scripts/dump-tools.mjs
```

각 서버 엔트리는 이게 전부입니다:

```ts
#!/usr/bin/env node

import { runServer, PRODUCTS } from "@ibm-docs-mcp/core";

runServer(PRODUCTS.apic);
```

## 새 제품 추가하기

1. `core/src/products.ts` 에 블록 하나 추가 (제품 키, 툴 이름, 설명 문구)
2. `<제품>-docs-mcp/` 폴더에 `package.json` / `tsconfig.json` / 3줄짜리 `src/index.ts`
3. 루트 `package.json` 의 `workspaces` 와 `tsconfig.json` 의 `references` 에 등록
4. `npm install && npm run build`

IWHI 처럼 구성 제품이 여러개면 `components` 에 제품 키를 나열하면 됩니다.
`components` 가 2개 이상이면 TOC 가 제품별로 그룹핑되고 `product` 필터가 자동으로 붙습니다.
`langs` 를 지정하면 `lang` 파라미터가 노출됩니다.

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

- TypeScript + Node.js (npm workspaces 모노레포)
- `@modelcontextprotocol/sdk` - MCP 프로토콜 구현
- `jsdom` + `turndown` - HTML to Markdown 변환
- IBM Docs API (`ibm.com/docs/api/v1`) - 문서 검색 및 조회

## License

MIT
