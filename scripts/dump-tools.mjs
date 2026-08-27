#!/usr/bin/env node
// 각 MCP 서버를 stdio로 띄워 tools/list 결과를 정규화해 출력한다.
// 리팩터링 전후의 툴 표면(이름/설명/스키마)이 동일한지 비교하는 데 쓴다.
//
//   node scripts/dump-tools.mjs > before.json
//   node scripts/dump-tools.mjs > after.json && diff before.json after.json

import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

function servers() {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.endsWith("-docs-mcp"))
    .map((e) => e.name)
    .sort();
}

function inspect(dir) {
  return new Promise((resolveP, rejectP) => {
    const entry = join(ROOT, dir, "dist", "index.js");
    const proc = spawn(process.execPath, [entry], { stdio: ["pipe", "pipe", "pipe"] });

    let buf = "";
    let stderr = "";
    let serverInfo = null;

    const timer = setTimeout(() => {
      proc.kill();
      rejectP(new Error(`${dir}: timeout (stderr: ${stderr.trim()})`));
    }, 30000);

    const send = (msg) => proc.stdin.write(JSON.stringify(msg) + "\n");

    // 서버가 transport를 붙이기 전(jsdom 로딩에 ~3초)에 보낸 요청은 유실된다.
    // 각 서버는 준비되면 stderr에 기동 메시지를 찍으므로 그것을 준비 신호로 쓴다.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      send({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "dump-tools", version: "1.0.0" },
        },
      });
    };
    const fallback = setTimeout(start, 10000);

    proc.on("error", rejectP);
    proc.stderr.on("data", (d) => {
      stderr += d;
      clearTimeout(fallback);
      start();
    });

    proc.stdout.on("data", (chunk) => {
      buf += chunk;
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        const msg = JSON.parse(line);

        if (msg.id === 1) {
          serverInfo = msg.result.serverInfo;
          send({ jsonrpc: "2.0", method: "notifications/initialized" });
          send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
        } else if (msg.id === 2) {
          clearTimeout(timer);
          clearTimeout(fallback);
          proc.kill();
          resolveP({
            directory: dir,
            serverInfo,
            startupMessage: stderr.trim(),
            tools: msg.result.tools
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name)),
          });
        }
      }
    });
  });
}

const out = [];
for (const dir of servers()) out.push(await inspect(dir));
console.log(JSON.stringify(out, null, 2));
