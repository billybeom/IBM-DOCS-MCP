# 코딩 모드 전용 규칙 (Non-Obvious)

- **Import 경로**: `core/src/` 내 TypeScript 파일 간 상대 경로 import는 Node16 모듈 해석 규칙에 따라 항상 명시적인 `.js` 확장자를 사용해야 합니다.
- **기동 지연 방지 (Lazy Loading)**: `jsdom`이나 `turndown` 같은 대형 의존성은 최상단에서 import하지 말고, [`core/src/utils.ts`](core/src/utils.ts)처럼 `createRequire`를 통한 지연 초기화를 사용하여 stdio 연결이 즉시 수립되도록 유지하세요.
- **TOC 응답 크기 제약**: 목차 렌더링 결과는 MCP 클라이언트의 페이로드 유실을 방지하기 위해 항상 [`capText()`](core/src/toc-view.ts) 및 `TOC_MAX_CHARS` (24,000자)로 감싸야 합니다.
- **stdio 환경 로깅 원칙**: `stdout`에는 절대 디버깅 문자열이나 임의 출력을 쓰지 마세요 (MCP JSON-RPC 프레임 전용). 진단 및 에러 출력은 `stderr`를 통하거나 [`installDiagnostics()`](core/src/diagnostics.ts)를 사용해야 합니다.
- **동적 Zod 스키마 구성**: 통합 서버는 다중 제품이 활성화된 경우에만 도구 스키마에 `product` enum을 동적으로 추가합니다. `IBM_DOCS_PRODUCTS` 환경변수로 제품이 1개로 한정되면 스키마에서 `productEnum`을 제거하여 모델 환각을 방지합니다.
- **제품 매칭 우선순위**: [`pickByNameOrKey()`](core/src/toc-view.ts)는 완전 일치(exact match)를 부분 일치보다 우선 검사하여 "API Connect" 검색 시 "API Connect for GraphQL"까지 잘못 매칭되는 문제를 방지합니다.
