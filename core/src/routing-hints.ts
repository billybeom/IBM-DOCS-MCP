// 통합 서버의 product enum 설명에 쓰이는 라우팅 힌트.
//
// products.ts 와 분리해 둔 이유: 제품의 "정체"(키, 툴 이름)와 모델이 제품을 고르기
// 위한 "판단 근거"는 성격이 다르고, 후자는 평가(scripts/eval-routing.mjs) 결과에
// 따라 자주 손보게 되기 때문이다.
//
// 제품당 한 줄. 제품이 늘어나면 이 파일만 늘어나고 툴 개수는 그대로다.

export const BLURBS: Record<string, string> = {
  apic: "IBM API Connect 12.1.x (독립 제품) — catalog/product/plan, OAuth provider, Developer Portal, Analytics, apic CLI",
  graphql:
    "IBM API Connect for GraphQL 1.1.x (자체 관리형) — StepZen, GraphQL 스키마, @rest/@dbquery 디렉티브",
  dpgw1100:
    "IBM DataPower Gateway 11.0.0 — 게이트웨이 어플라이언스. MPGW, XSLT, GatewayScript, WebGUI/CLI 명령",
  idig: "IBM DataPower Interact Gateway 12.1.1 — DataPower Gateway 11.0.0 과 별개 제품군",
  iwhi: "IBM webMethods Hybrid Integration — webMethods Integration, App Connect, B2B, webMethods API Gateway, Developer Portal, Event Endpoint Management, 그리고 이 번들판 API Connect / API Connect for GraphQL",
  activetransfer:
    "IBM webMethods ActiveTransfer 12.1.0 — 관리형 파일 전송(MFT). ActiveTransfer Server/Gateway/Agent, 가상 폴더, 리스너(SFTP/FTPS/HTTPS), 스케줄 전송, 파트너 파일 교환",
  instana:
    "IBM Instana Observability — APM, 분산 트레이싱, Kubernetes 모니터링, alerting (SaaS / Self-Hosted 에디션)",
  concert: "IBM Concert 2.3.x — 애플리케이션 인벤토리, 리스크/컴플라이언스",
  wminfra:
    "IBM webMethods Infrastructure 12.1.0 — wM 제품군 공통 인프라. 설치, 설정, 클러스터링, 런타임 환경",
  wminstaller:
    "IBM webMethods Installer 12.1.0 — wM 제품 설치·업그레이드·패치·무인(silent) 설치 도구",
  wmdesigner:
    "IBM webMethods Designer 12.1.0 — IS/MSR 개발 IDE. Flow Service 편집기, 서비스 팔레트, 디버깅",
  wmis:
    "IBM webMethods Integration Server (IS) 12.1.0 — 통합 런타임. Flow Service, 어댑터, 트리거, JDBC, REST/SOAP API",
  wmmsr:
    "IBM webMethods Microservices Runtime (MSR) 12.1.0 — 컨테이너 기반 경량 IS. Docker, Kubernetes 배포",
  wmcloudstreams:
    "IBM webMethods CloudStreams 12.1.0 — SaaS/클라우드 연결. 클라우드 커넥터, OAuth, 가상 서비스",
  wmum:
    "IBM webMethods Universal Messaging (UM) 12.1.0 — 메시징 미들웨어. 채널, 큐, Publish-Subscribe, Realm Server",
  wmbroker:
    "IBM webMethods Broker 12.1.0 — 문서 기반 메시징 브로커. 문서 유형, 클라이언트 그룹, 영역(Territory)",
};

/**
 * 실제로 헷갈리는 쌍만 적는다.
 * scripts/eval-routing.mjs 로 측정한 오분류가 근거다 —
 * 오류의 대부분이 iwhi 가 apic/graphql 을 품고 있는 데서 나왔다.
 */
export const OVERLAP_NOTES: string[] = [
  '"apic" 과 "iwhi" 에 각각 다른 API Connect 가 있습니다. 독립 제품이면 "apic", webMethods Hybrid Integration 번들이면 "iwhi".',
  '"graphql" 과 "iwhi" 에 각각 다른 API Connect for GraphQL 이 있습니다. 자체 관리형이면 "graphql", 번들/SaaS 면 "iwhi".',
  '"dpgw1100" 과 "idig" 는 둘 다 DataPower 지만 다른 제품입니다.',
  '"iwhi" 와 "activetransfer" 는 둘 다 webMethods 지만 다른 제품입니다. 파일 전송(MFT)이면 "activetransfer", 통합·API·B2B 쪽이면 "iwhi".',
  'API Connect 의 게이트웨이는 DataPower 이므로 OAuth·게이트웨이 주제는 "apic" 과 "dpgw1100" 양쪽에 존재합니다.',
  '"wmis" 와 "wmmsr" 는 둘 다 Integration Server 계열이지만 다른 제품입니다. 전통적인 IS 런타임이면 "wmis", 컨테이너/경량 런타임이면 "wmmsr".',
  '"wmum" 과 "wmbroker" 는 둘 다 메시징 제품이지만 다른 제품입니다. Universal Messaging(채널/큐)이면 "wmum", webMethods Broker(문서 유형 기반)이면 "wmbroker".',
  '"wmis"/"wmmsr"/"wmum"/"wmbroker" 는 독립 문서 서버입니다. "iwhi" 에 번들된 Integration/API Gateway 문서와는 다릅니다.',
];

/** product 파라미터 설명문을 조립한다. */
export function buildProductDescription(
  entries: { id: string; label: string }[]
): string {
  const lines = entries.map(
    ({ id, label }) => `- "${id}" ${BLURBS[id] ?? label}`
  );
  const ids = new Set(entries.map((e) => e.id));
  // 노출된 제품에 실제로 해당하는 주의사항만 남긴다.
  const notes = OVERLAP_NOTES.filter((n) => {
    const referenced = [...n.matchAll(/"([a-z0-9]+)"/g)].map((m) => m[1]);
    return referenced.length === 0 || referenced.every((r) => ids.has(r));
  });

  return [
    "검색할 IBM 제품. 생략하면 전 제품을 검색해 제품별로 묶어 돌려줍니다(라우팅 모드).",
    ...lines,
    ...(notes.length ? ["", "혼동 주의:", ...notes.map((n) => `- ${n}`)] : []),
  ].join("\n");
}
