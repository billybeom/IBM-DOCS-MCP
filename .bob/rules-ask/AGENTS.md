# 문서 및 컨텍스트 규칙 (Non-Obvious)

- **2가지 형태의 MCP 서버**:
  - **통합 서버 (`unified/`)**: `product` 필터 파라미터를 지원하는 범용 3개 도구(`search_ibm_docs`, `read_ibm_doc`, `get_ibm_toc`) 제공.
  - **개별 제품 서버 (`<product>-docs-mcp/`)**: 제품별 접두사가 붙은 3개 도구(예: `search_apic_docs`, `read_apic_doc`, `get_apic_toc`) 제공.
- **제품군(Family) 키 vs 에디션(Edition) 키**:
  - `instana`는 실제 에디션별 키(`SSO4JPD`, `SSZMH3N_1.0.323`, `SSV8Z4_1.0.323`)를 사용합니다. 패밀리 키인 `SSE1JP5`는 자체 문서 세트가 없어 TOC 조회 및 본문 요청 시 404가 발생하므로 사용하면 안 됩니다.
  - `iwhi`는 9개 구성 제품(webMethods Integration, App Connect, B2B, API Gateway, Developer Portal 등)의 문서를 하나로 묶어 제공합니다.
- **제품 간 혼동 및 중복 주의사항**:
  - `apic` (독립 설치형 12.1.x) vs `iwhi` (webMethods 번들 포함 API Connect).
  - `graphql` (자체 호스팅 1.1.x) vs `iwhi` (SaaS/번들판 GraphQL).
  - `dpgw1100` (DataPower Gateway 11.0.0) vs `idig` (DataPower Interact Gateway 12.1.1).
  - `iwhi` (webMethods 통합) vs `activetransfer` (webMethods MFT 파일 전송).
