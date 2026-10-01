# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 빌드 및 검증 명령어
```bash
# 전체 워크스페이스 빌드 (TypeScript 프로젝트 레퍼런스 증분 빌드)
npm run build          # tsc -b
npm run rebuild        # tsc -b --clean && tsc -b

# 단일 패키지 빌드 (루트에서 tsc 사용 또는 각 패키지 디렉토리 내에서 실행)
npx tsc -b core
npx tsc -b apic-docs-mcp

# 검증 및 평가 (Jest/Vitest 등의 별도 테스트 러너 없음; 스크립트로 스키마 및 라우팅 검증)
npm run dump-tools     # stdio 기반 전 서버 MCP 도구 스키마/표면 검증
npm run eval-routing   # 실제 IBM Docs API 대상 제품 분류/라우팅 정확도 측정
```

## 비직관적인 아키텍처 및 코드 규칙 (Non-Obvious)

- **모노레포 구조**: npm workspaces 및 TypeScript project references (`composite: true`, `target: ES2022`, `module: Node16`) 구성. 모든 패키지는 `@ibm-docs-mcp/core`를 참조합니다.
- **ESM 확장자 명시 필수**: [`core/src/`](core/src/index.ts) 내부의 상대 경로 import는 `.ts` 소스를 참조하더라도 반드시 명시적인 `.js` 확장자를 사용해야 합니다 (예: `import { PRODUCTS } from "./products.js"`).
- **지연 로딩(Lazy Loading)**: [`core/src/utils.ts`](core/src/utils.ts)에서 무거운 의존성(`jsdom`, `turndown`)은 최상단에서 import하지 않고, 첫 도구 실행 시 `require("jsdom")` / `require("turndown")`으로 지연 로드합니다 (MCP 서버 콜드 스타트 시 `stdio` 연결 블로킹 방지).
- **TOC 응답 길이 제한 (Capping)**: 목차(TOC) 응답은 클라이언트의 버퍼 초과로 인한 응답 누락을 막기 위해 [`capText()`](core/src/toc-view.ts)를 통해 최대 24,000자([`TOC_MAX_CHARS`](core/src/toc-view.ts:9))로 제한됩니다.
- **종료 진단 로깅**: [`core/src/diagnostics.ts`](core/src/diagnostics.ts)는 파이프 종료나 예외 발생 시 버퍼 유실을 방지하기 위해 `stderr`에 `writeSync(2, ...)`로 동기 출력합니다. `stdout`에는 MCP JSON-RPC 프레임 외의 로그를 절대 출력하지 마세요.
- **신규 제품 문서 서버 추가 절차**:
  1. [`core/src/products.ts`](core/src/products.ts)에 제품 메타데이터 및 컴포넌트 키 추가.
  2. [`core/src/routing-hints.ts`](core/src/routing-hints.ts)에 요약 설명 및 혼동 방지 주의사항 추가.
  3. `<제품>-docs-mcp/` 폴더를 만들고 표준 `package.json`, `tsconfig.json`, `runServer(PRODUCTS.<id>)`를 호출하는 3줄짜리 `src/index.ts` 작성.
  4. 루트 [`package.json`](package.json)의 `workspaces`와 루트 [`tsconfig.json`](tsconfig.json)의 `references`에 신규 폴더 등록.
