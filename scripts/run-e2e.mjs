import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const host = "127.0.0.1";
const port = 3100;
const baseURL = `http://${host}:${port}`;
const isWindows = process.platform === "win32";

function waitForExit(child, timeoutMs) {
  if (child.exitCode !== null) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.off("exit", onExit);
      child.off("error", onExit);
      resolve(false);
    }, timeoutMs);
    const onExit = () => {
      clearTimeout(timer);
      child.off("exit", onExit);
      child.off("error", onExit);
      resolve(true);
    };
    child.once("exit", onExit);
    child.once("error", onExit);
  });
}

async function waitForServer(server) {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`The test server exited with code ${server.exitCode}.`);
    }

    try {
      const response = await fetch(baseURL, { signal: AbortSignal.timeout(2_000) });
      if (response.status < 500) return;
    } catch {
      // The server is still starting.
    }

    await delay(200);
  }

  throw new Error("The test server did not become ready in time.");
}

async function stopServer(server) {
  if (server.exitCode !== null || server.pid === undefined) return;

  if (isWindows) {
    const taskkill = spawn(
      "taskkill.exe",
      ["/PID", String(server.pid), "/T", "/F"],
      { stdio: "ignore", windowsHide: true },
    );
    const taskkillExited = await waitForExit(taskkill, 5_000);
    if (!taskkillExited) taskkill.kill();
  } else {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }

  const exited = await waitForExit(server, 5_000);
  if (!exited) {
    try {
      if (isWindows) server.kill();
      else process.kill(-server.pid, "SIGKILL");
    } catch {
      // The process already exited.
    }
  }
}

function runPlaywright() {
  const child = spawn(
    process.execPath,
    ["./node_modules/@playwright/test/cli.js", "test"],
    {
      env: { ...process.env, PLAYWRIGHT_EXTERNAL_SERVER: "1" },
      stdio: "inherit",
      windowsHide: true,
    },
  );

  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

const server = spawn(
  process.execPath,
  [
    "./node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    host,
    "--port",
    String(port),
  ],
  {
    detached: !isWindows,
    stdio: "inherit",
    windowsHide: true,
  },
);

let exitCode = 1;

try {
  await Promise.race([
    waitForServer(server),
    new Promise((_, reject) => server.once("error", reject)),
  ]);
  exitCode = await runPlaywright();
} finally {
  await stopServer(server);
}

process.exitCode = exitCode;
