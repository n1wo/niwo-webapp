import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const HOST = "127.0.0.1";
const PORT = Number(process.env.ROUTE_CHECK_PORT ?? 3020);
const BASE_URL = `http://${HOST}:${PORT}`;

const requiredRoutes = [
  { path: "/", statuses: [307, 308], location: "/en" },
  { path: "/en", statuses: [200] },
  { path: "/de", statuses: [200] },
  { path: "/robots.txt", statuses: [200] },
  { path: "/.well-known/security.txt", statuses: [200] },
];

const optionalRoutes = [
  { path: "/security.txt", statuses: [200, 301, 302, 307, 308, 404] },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const deadline = Date.now() + 30000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/en`, { redirect: "manual" });
      if (response.status === 200) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await wait(500);
  }

  throw new Error(`Timed out waiting for ${BASE_URL}`);
}

async function checkRoute({ path, statuses, location }) {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
  const actualLocation = response.headers.get("location") ?? "";

  if (!statuses.includes(response.status)) {
    throw new Error(
      `${path} returned ${response.status}, expected ${statuses.join(" or ")}`,
    );
  }

  if (location && !actualLocation.endsWith(location)) {
    throw new Error(
      `${path} redirected to ${actualLocation || "(no location)"}, expected ${location}`,
    );
  }

  console.log(`${path} -> ${response.status}${actualLocation ? ` ${actualLocation}` : ""}`);
}

const standaloneServer = ".next/standalone/server.js";
const useStandaloneServer = existsSync(standaloneServer);
const serverArgs = useStandaloneServer
  ? [standaloneServer]
  : ["node_modules/next/dist/bin/next", "start", "--hostname", HOST, "--port", String(PORT)];

const server = spawn(process.execPath, serverArgs, {
  env: {
    ...process.env,
    HOSTNAME: HOST,
    PORT: String(PORT),
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", (chunk) => process.stdout.write(chunk));
server.stderr.on("data", (chunk) => process.stderr.write(chunk));

try {
  await waitForServer();

  for (const route of requiredRoutes) {
    await checkRoute(route);
  }

  for (const route of optionalRoutes) {
    await checkRoute(route);
  }
} finally {
  server.kill();
}
