import { spawn } from "node:child_process";
import { cpSync, existsSync } from "node:fs";

const HOST = "127.0.0.1";
const PORT = Number(process.env.ROUTE_CHECK_PORT ?? 3020);
const BASE_URL = `http://${HOST}:${PORT}`;

const requiredRoutes = [
  { path: "/", statuses: [307, 308], location: "/en" },
  {
    path: "/en",
    statuses: [200],
    contains: [
      "Complex security topics, explained clearly",
      "AI in DevSecOps",
      "Agentic Engineering",
      "Incident Response",
      'data-topic-artwork="aiDevSecOps"',
      'data-topic-artwork="agenticEngineering"',
      'data-topic-artwork="incidentResponse"',
      'data-topic-nav="webAppSecurity"',
      'data-topic-nav="secureDevelopment"',
      'data-topic-nav="pentestPreparation"',
      'data-topic-nav="aiDevSecOps"',
      'data-topic-nav="agenticEngineering"',
      'data-topic-nav="incidentResponse"',
      'data-all-topics-link="mobile"',
    ],
    notContains: [
      "/terminal-closed",
      'data-topic-artwork="webAppSecurity"',
      'data-topic-artwork="secureDevelopment"',
      'data-topic-artwork="pentestPreparation"',
    ],
    occurrences: [
      { needle: "data-topic-artwork=", count: 3 },
      { needle: "data-topic-nav=", count: 6 },
      { needle: 'data-all-topics-link="mobile"', count: 1 },
    ],
    ordered: [
      'data-topic-nav="webAppSecurity"',
      'data-topic-nav="secureDevelopment"',
      'data-topic-nav="pentestPreparation"',
      'data-topic-nav="aiDevSecOps"',
      'data-topic-nav="agenticEngineering"',
      'data-topic-nav="incidentResponse"',
      'data-all-topics-link="mobile"',
    ],
  },
  {
    path: "/de",
    statuses: [200],
    contains: [
      "Komplexe Security-Themen, klar erklärt",
      "AI in DevSecOps",
      "Agentic Engineering",
      "Incident Response",
      'data-topic-artwork="aiDevSecOps"',
      'data-topic-artwork="agenticEngineering"',
      'data-topic-artwork="incidentResponse"',
      'data-topic-nav="webAppSecurity"',
      'data-topic-nav="secureDevelopment"',
      'data-topic-nav="pentestPreparation"',
      'data-topic-nav="aiDevSecOps"',
      'data-topic-nav="agenticEngineering"',
      'data-topic-nav="incidentResponse"',
      'data-all-topics-link="mobile"',
    ],
    notContains: [
      "/terminal-closed",
      'data-topic-artwork="webAppSecurity"',
      'data-topic-artwork="secureDevelopment"',
      'data-topic-artwork="pentestPreparation"',
    ],
    occurrences: [
      { needle: "data-topic-artwork=", count: 3 },
      { needle: "data-topic-nav=", count: 6 },
      { needle: 'data-all-topics-link="mobile"', count: 1 },
    ],
    ordered: [
      'data-topic-nav="webAppSecurity"',
      'data-topic-nav="secureDevelopment"',
      'data-topic-nav="pentestPreparation"',
      'data-topic-nav="aiDevSecOps"',
      'data-topic-nav="agenticEngineering"',
      'data-topic-nav="incidentResponse"',
      'data-all-topics-link="mobile"',
    ],
  },
  {
    path: "/en/topics",
    statuses: [200],
    contains: [
      "Six connected security topics",
      "Web App Security",
      "Secure Development",
      "Pentest Preparation",
      "AI in DevSecOps",
      "Agentic Engineering",
      "Incident Response",
      'data-topics-index="true"',
    ],
    notContains: ["TopicArticles.index.", "TopicArticles.items."],
    occurrences: [{ needle: "data-topic-index=", count: 6 }],
    ordered: [
      'data-topic-index="webAppSecurity"',
      'data-topic-index="secureDevelopment"',
      'data-topic-index="pentestPreparation"',
      'data-topic-index="aiDevSecOps"',
      'data-topic-index="agenticEngineering"',
      'data-topic-index="incidentResponse"',
    ],
  },
  {
    path: "/de/topics",
    statuses: [200],
    contains: [
      "Sechs miteinander verbundene Security-Themen",
      "Web App Security",
      "Sichere Entwicklung",
      "Pentest-Vorbereitung",
      "AI in DevSecOps",
      "Agentic Engineering",
      "Incident Response",
      'data-topics-index="true"',
    ],
    notContains: ["TopicArticles.index.", "TopicArticles.items."],
    occurrences: [{ needle: "data-topic-index=", count: 6 }],
    ordered: [
      'data-topic-index="webAppSecurity"',
      'data-topic-index="secureDevelopment"',
      'data-topic-index="pentestPreparation"',
      'data-topic-index="aiDevSecOps"',
      'data-topic-index="agenticEngineering"',
      'data-topic-index="incidentResponse"',
    ],
  },
  {
    path: "/en/topics/ai-in-devsecops",
    statuses: [200],
    contains: ["AI in DevSecOps", "How it works in practice", "Human responsibility"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/de/topics/ai-in-devsecops",
    statuses: [200],
    contains: ["AI in DevSecOps", "So funktioniert es in der Praxis", "Menschliche Verantwortung"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/en/topics/agentic-engineering",
    statuses: [200],
    contains: ["Agentic Engineering", "How an agentic workflow works", "Risks and limitations"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/de/topics/agentic-engineering",
    statuses: [200],
    contains: ["Agentic Engineering", "So läuft ein agentischer Workflow ab", "Risiken und Grenzen"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/en/topics/incident-response",
    statuses: [200],
    contains: ["Incident Response", "How the response unfolds", "Sources and further reading"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/de/topics/incident-response",
    statuses: [200],
    contains: ["Incident Response", "So verläuft die Reaktion", "Quellen und weiterführende Literatur"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/en/topics/web-app-security",
    statuses: [200],
    contains: ["Web App Security", "How a request moves through an application", "What testing can and cannot prove", 'data-topic-artwork="webAppSecurity"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/de/topics/web-app-security",
    statuses: [200],
    contains: ["Web App Security", "Wie eine Anfrage durch die Anwendung läuft", "Was Tests belegen können - und was nicht", 'data-topic-artwork="webAppSecurity"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/en/topics/secure-development",
    statuses: [200],
    contains: ["Secure Development", "A practical secure-development lifecycle", "Example: adding a customer-data export", 'data-topic-artwork="secureDevelopment"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/de/topics/secure-development",
    statuses: [200],
    contains: ["Sichere Entwicklung", "Ein praktikabler Lebenszyklus für sichere Entwicklung", "Beispiel: Export von Kundendaten", 'data-topic-artwork="secureDevelopment"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/en/topics/penetration-testing",
    statuses: [200],
    contains: ["Pentest Preparation, explained | niwo", "How a penetration test is prepared and delivered", "Example: scoping a small SaaS application", "Authorization, coordination, and ownership", "NIST SP 800-115", 'data-topic-artwork="pentestPreparation"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/de/topics/penetration-testing",
    statuses: [200],
    contains: ["Pentest-Vorbereitung verständlich erklärt | niwo", "So wird ein Penetrationstest vorbereitet und durchgeführt", "Beispiel: Scope für eine kleine SaaS-Anwendung", "Freigabe, Koordination und Verantwortung", "NIST SP 800-115", 'data-topic-artwork="pentestPreparation"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/en/services/web-app-security",
    statuses: [308],
    location: "/en/topics/web-app-security",
  },
  {
    path: "/de/services/web-app-security",
    statuses: [308],
    location: "/de/topics/web-app-security",
  },
  {
    path: "/en/services/secure-development",
    statuses: [308],
    location: "/en/topics/secure-development",
  },
  {
    path: "/de/services/secure-development",
    statuses: [308],
    location: "/de/topics/secure-development",
  },
  {
    path: "/en/services/penetration-testing",
    statuses: [308],
    location: "/en/topics/penetration-testing",
  },
  {
    path: "/de/services/penetration-testing",
    statuses: [308],
    location: "/de/topics/penetration-testing",
  },
  { path: "/robots.txt", statuses: [200] },
  {
    path: "/sitemap.xml",
    statuses: [200],
    contains: [
      "/en/pages/phishing-lab",
      "/de/pages/phishing-lab",
      "/en/topics</loc>",
      "/de/topics</loc>",
      "/en/topics/ai-in-devsecops",
      "/de/topics/agentic-engineering",
      "/en/topics/incident-response",
      "/en/topics/web-app-security",
      "/de/topics/secure-development",
      "/en/topics/penetration-testing",
      "/de/topics/penetration-testing",
    ],
  },
  { path: "/.well-known/security.txt", statuses: [200] },
  { path: "/en/pages/phishing-lab", statuses: [200] },
  { path: "/de/pages/phishing-lab", statuses: [200] },
  {
    path: "/en/pages/about",
    statuses: [200],
    contains: [
      "Phishing Defense Lab",
      "OWASP Lab Detection Engine",
      "This website",
      "Software Development",
    ],
  },
  {
    path: "/de/pages/about",
    statuses: [200],
    contains: [
      "Phishing Defense Lab",
      "OWASP Lab Detection Engine",
      "Diese Website",
      "Softwareentwicklung",
    ],
  },
  { path: "/assets/logos/niwologo.svg", statuses: [200] },
];

const optionalRoutes = [
  { path: "/security.txt", statuses: [200, 301, 302, 307, 308, 404] },
];

// HTTPS-only headers are the secure default; they may only be dropped by the
// explicit LOCAL_PREVIEW=1 build-time opt-out. When the flag is unset, assert
// they are present so a regression of the secure default fails CI.
async function checkSecurityHeaders() {
  if (process.env.LOCAL_PREVIEW === "1") {
    console.log("security headers -> skipped (LOCAL_PREVIEW=1)");
    return;
  }

  const response = await fetch(`${BASE_URL}/en`, { redirect: "manual" });
  const csp = response.headers.get("content-security-policy") ?? "";
  const hsts = response.headers.get("strict-transport-security");

  if (!csp.includes("upgrade-insecure-requests")) {
    throw new Error(
      "CSP is missing upgrade-insecure-requests — secure default regressed (was the build run with LOCAL_PREVIEW=1?)",
    );
  }

  if (!hsts) {
    throw new Error(
      "Strict-Transport-Security header is missing — secure default regressed (was the build run with LOCAL_PREVIEW=1?)",
    );
  }

  console.log("security headers -> HSTS + upgrade-insecure-requests present");
}

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

async function checkRoute({
  path,
  statuses,
  location,
  contains,
  notContains,
  occurrences,
  ordered,
}) {
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

  if (contains?.length || notContains?.length || occurrences?.length || ordered?.length) {
    const body = await response.text();

    for (const needle of contains ?? []) {
      if (!body.includes(needle)) {
        throw new Error(`${path} is missing expected content: "${needle}"`);
      }
    }

    for (const needle of notContains ?? []) {
      if (body.includes(needle)) {
        throw new Error(`${path} contains forbidden content: "${needle}"`);
      }
    }

    for (const { needle, count } of occurrences ?? []) {
      const actualCount = body.split(needle).length - 1;
      if (actualCount !== count) {
        throw new Error(
          `${path} contains "${needle}" ${actualCount} times, expected ${count}`,
        );
      }
    }

    let previousIndex = -1;
    for (const needle of ordered ?? []) {
      const nextIndex = body.indexOf(needle, previousIndex + 1);
      if (nextIndex === -1) {
        throw new Error(`${path} is missing ordered content after offset ${previousIndex}: "${needle}"`);
      }
      previousIndex = nextIndex;
    }
  }

  console.log(`${path} -> ${response.status}${actualLocation ? ` ${actualLocation}` : ""}`);
}

const standaloneServer = ".next/standalone/server.js";
const useStandaloneServer = existsSync(standaloneServer);

if (useStandaloneServer) {
  // The standalone output does not include static assets; copy them in the
  // same way a real deployment does, so asset routes can be checked.
  cpSync("public", ".next/standalone/public", { recursive: true });
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
}
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

  await checkSecurityHeaders();
} finally {
  server.kill();
}
