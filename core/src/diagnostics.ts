// 종료 진단.
//
// MCP stdio 서버는 stdin 이 열려 있는 것 말고는 이벤트 루프를 붙잡는 게 없다.
// 그래서 클라이언트가 파이프를 닫으면(절전/최대 절전, 호스트 프로세스 교체 등)
// 프로세스가 exit code 0 으로, 아무 출력도 남기지 않고 사라진다.
// 클라이언트 로그에는 "Server transport closed unexpectedly" 만 남아 진단이 불가능하다.
//
// 여기서는 죽는 이유를 stderr 에 남긴다. MCP 클라이언트는 서버의 stderr 를
// 자기 로그에 그대로 실어주므로, 다음에 같은 일이 나면 원인이 바로 보인다.

import { writeSync } from "node:fs";

/**
 * stderr 에 동기로 쓴다.
 * 파이프로 연결된 stderr 는 비동기라, 프로세스가 곧바로 죽으면 버퍼가 유실된다.
 * 종료 직전 메시지가 목적이므로 동기 쓰기가 필요하다.
 */
function log(line: string): void {
  try {
    writeSync(2, `${line}\n`);
  } catch {
    // stderr 가 이미 닫혔으면 할 수 있는 게 없다.
  }
}

/** 서버 기동 시 한 번 호출한다. */
export function installDiagnostics(label: string): void {
  const startedAt = Date.now();
  let reason: string | undefined;

  const uptime = () => {
    const s = Math.round((Date.now() - startedAt) / 1000);
    if (s < 60) return `${s}초`;
    if (s < 3600) return `${Math.floor(s / 60)}분 ${s % 60}초`;
    return `${Math.floor(s / 3600)}시간 ${Math.floor((s % 3600) / 60)}분`;
  };

  // 가장 흔한 종료 경로. 클라이언트가 파이프를 닫으면 여기로 온다.
  process.stdin.on("end", () => {
    reason ??= "stdin closed by the client";
  });
  process.stdin.on("error", (e) => {
    reason = `stdin error: ${e}`;
  });
  process.stdout.on("error", (e) => {
    reason = `stdout error: ${e}`;
  });

  process.on("uncaughtException", (e) => {
    log(`[${label}] uncaught exception after ${uptime()}: ${e?.stack ?? e}`);
    process.exit(1);
  });
  process.on("unhandledRejection", (e) => {
    const err = e as Error;
    log(`[${label}] unhandled rejection after ${uptime()}: ${err?.stack ?? String(e)}`);
    process.exit(1);
  });

  for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"] as const) {
    process.on(sig, () => {
      reason = `received ${sig}`;
      process.exit(0);
    });
  }

  process.on("exit", (code) => {
    log(
      `[${label}] exiting (code ${code}) after ${uptime()} — ` +
        (reason ?? "nothing left holding the event loop")
    );
  });
}
