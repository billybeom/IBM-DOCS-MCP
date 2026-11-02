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
  wmmywebmethods:
    "IBM My webMethods Server 12.1.0 — 포털 기반 BPM/작업 관리. 대시보드, Task, 비즈니스 프로세스, 사용자 관리",
  wmmonitor:
    "IBM webMethods Monitor 12.1.0 — 프로세스 및 서비스 모니터링. 실행 로그, 오류 추적, 알림",
  wmupdatemgr:
    "IBM webMethods Update Manager 12.0.0 — 제품 업데이트·픽스·롤백 관리 도구",
  wmadapters:
    "IBM webMethods Adapters — IS/MSR용 어댑터 모음. JDBC, SAP, Salesforce, JMS 등 외부 시스템 연결",
  wmdeployer:
    "IBM webMethods Deployer 12.1.0 — 통합 런타임 배포 자동화. 프로젝트, 후보, 저장소, 배포 계획",
  wmcommandcentral:
    "IBM webMethods Command Central 12.1.0 — 제품 수명 주기 관리. Platform Manager, 템플릿, 프로비저닝",
  bigmemorymax:
    "IBM BigMemory Max 4.5.1 — 대용량 인메모리 데이터 관리. Ehcache 기반 분산 캐시",
  terracotta:
    "IBM Terracotta 12.1.0 — 분산 인메모리 클러스터링. Ehcache, 세션 관리, 고가용성",
  wmb2btrading:
    "IBM webMethods B2B Trading Networks 12.1.0 — B2B 거래 네트워크. 거래 파트너, EDI, 문서 교환, 라우팅",
  wmestandards:
    "IBM webMethods eStandards — B2B 전자표준 모듈. EDIFACT, X12, HL7, RosettaNet 스키마",
  wmpkgregistry:
    "IBM webMethods Package Registry (SaaS) — 통합 패키지 레지스트리. 아티팩트 게시 및 관리",
  wme2emonitoring:
    "IBM webMethods End-to-End Monitoring (SaaS) — 통합 E2E 모니터링. 트랜잭션 추적, 대시보드, 알림(SaaS)",
  ace: "IBM App Connect Enterprise 13.0 — 메시지 플로우 기반 통합 런타임. Toolkit, Integration Server, REST/SOAP API",
  iib: "IBM Integration Bus 10.1.0 — 엔터프라이즈 메시지 브로커. 메시지 플로우, ESQL, 다양한 전송 프로토콜 지원",
  aspera: "IBM Aspera 1.1.x — FASP 기반 고속 파일 전송 플랫폼 개요 및 공통 가이드",
  asperacargo: "IBM Aspera Cargo 4.2 — Aspera 고속 전송 임베디드 클라이언트 라이브러리",
  asperaconnect: "IBM Aspera Connect 4.2 — 브라우저 플러그인 및 SDK 기반 웹 통합 전송 클라이언트",
  asperaconsole: "IBM Aspera Console 3.4 — 전송 모니터링 및 관리 대시보드. 노드/보고서/알림",
  asperade: "Aspera Desktop Client 4.4 — 데스크톱 GUI 기반 FASP 파일 전송 클라이언트",
  asperawebapps: "IBM Aspera Enterprise WebApps — 엔터프라이즈 웹 전송 포털. 업로드/다운로드",
  asperafasp: "Aspera FASP Proxy 1.4 — 방화벽 통과용 FASP UDP 릴레이 프록시",
  asperafaspex: "IBM Aspera Faspex 5.0 — 파일 교환 패키지 서버. 받은 편지함, 워크그룹, 패키지 배달",
  asperafaspio: "IBM Aspera faspio 1.3 — TCP-to-FASP 터널 게이트웨이. 기존 TCP 애플리케이션의 고속 전송 지원",
  asperahste: "IBM Aspera High-Speed Transfer Endpoint (HSTE) 4.4 — 경량 FASP 전송 엔드포인트",
  asperahsts: "IBM Aspera High-Speed Transfer Server (HSTS) 4.4 — 서버측 FASP 전송 서버. Node API, 고가용성",
  asperalite: "IBM Aspera Lite — 경량 Aspera 임베디드 전송 에이전트",
  asperaoc: "IBM Aspera On Cloud — SaaS 기반 고속 파일 전송 플랫폼. 워크스페이스, 패키지, 파일 관리",
  asperaorch: "IBM Aspera Orchestrator 4.1.0 — 워크플로우 자동화 및 전송 오케스트레이션. 플러그인, 스케줄",
  asperaproxy: "IBM Aspera Proxy Gateway 2.3 — FASP 트래픽 프록시/릴레이 게이트웨이. 방화벽 우회",
  asperashares: "IBM Aspera Shares 1.11.0 — 폴더 공유 및 협업 파일 전송 서버. 권한 관리",
  asperavalidator: "IBM Aspera Validator 1.0 — 전송 무결성 검증. 체크섬, 파일 확인",
  ibmmq: "IBM MQ 10.0.0 — 엔터프라이즈 메시지 큐잉. 큐 매니저, 채널, Pub/Sub, JMS, MQ 클라이언트",
  ibmmqappliance: "IBM MQ Appliance 10.0.0 — 전용 MQ 하드웨어 어플라이언스. HA, DR, 네트워크 통합",
  ibmmqaas: "IBM MQ as a Service — 클라우드 관리형 MQ 서비스(SaaS). 서비스 인스턴스, 연결 설정",
  ibmmqhpe: "IBM MQ for HPE NonStop 8.1.0 — HPE NonStop 플랫폼용 내결함성 MQ. 고가용성 메시지 큐",
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
