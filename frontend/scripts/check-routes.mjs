import { spawn } from "node:child_process";
import { cpSync, existsSync } from "node:fs";

const HOST = "127.0.0.1";
const PORT = Number(process.env.ROUTE_CHECK_PORT ?? 3020);
const BASE_URL = `http://${HOST}:${PORT}`;
const locales = ["en", "de"];
const topicDefinitions = [
  { key: "webAppSecurity", slug: "web-app-security" },
  { key: "secureDevelopment", slug: "secure-development" },
  { key: "pentestPreparation", slug: "penetration-testing" },
  { key: "aiDevSecOps", slug: "ai-in-devsecops" },
  { key: "agenticEngineering", slug: "agentic-engineering" },
  { key: "incidentResponse", slug: "incident-response" },
];

const requiredRoutes = [
  { path: "/", statuses: [307, 308], location: "/en" },
  {
    path: "/en",
    statuses: [200],
    kind: "home",
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
      "All topics",
      'href="/en/topics"',
      ...topicDefinitions.map(({ slug }) => `href="/en/topics/${slug}"`),
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
      { needle: "data-topic-editorial-row=", count: 3 },
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
    kind: "home",
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
      "Alle Themen",
      'href="/de/topics"',
      ...topicDefinitions.map(({ slug }) => `href="/de/topics/${slug}"`),
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
      { needle: "data-topic-editorial-row=", count: 3 },
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
    kind: "index",
    contains: [
      "Six guides that build on each other",
      "Web App Security",
      "Secure Development",
      "Pentest Preparation",
      "AI in DevSecOps",
      "Agentic Engineering",
      "Incident Response",
      'data-topics-index="true"',
      "All topics",
      'href="/en/topics"',
      ...topicDefinitions.map(({ slug }) => `href="/en/topics/${slug}"`),
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
    kind: "index",
    contains: [
      "Sechs Leitfäden, die aufeinander aufbauen",
      "Web App Security",
      "Sichere Entwicklung",
      "Pentest-Vorbereitung",
      "AI in DevSecOps",
      "Agentic Engineering",
      "Incident Response",
      'data-topics-index="true"',
      "Alle Themen",
      'href="/de/topics"',
      ...topicDefinitions.map(({ slug }) => `href="/de/topics/${slug}"`),
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
    kind: "article",
    artworkKey: "aiDevSecOps",
    contains: ["AI in DevSecOps", "How it works in practice", "Human responsibility"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/de/topics/ai-in-devsecops",
    statuses: [200],
    kind: "article",
    artworkKey: "aiDevSecOps",
    contains: ["AI in DevSecOps", "So funktioniert es in der Praxis", "Menschliche Verantwortung"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/en/topics/agentic-engineering",
    statuses: [200],
    kind: "article",
    artworkKey: "agenticEngineering",
    contains: ["Agentic Engineering", "How an agentic workflow works", "Risks and limitations"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/de/topics/agentic-engineering",
    statuses: [200],
    kind: "article",
    artworkKey: "agenticEngineering",
    contains: ["Agentic Engineering", "So läuft ein agentischer Workflow ab", "Risiken und Grenzen"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/en/topics/incident-response",
    statuses: [200],
    kind: "article",
    artworkKey: "incidentResponse",
    contains: ["Incident Response", "How the response unfolds", "Sources and further reading"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/de/topics/incident-response",
    statuses: [200],
    kind: "article",
    artworkKey: "incidentResponse",
    contains: ["Incident Response", "So verläuft die Reaktion", "Quellen und weiterführende Literatur"],
    notContains: ["TopicArticles.items."],
  },
  {
    path: "/en/topics/web-app-security",
    statuses: [200],
    kind: "article",
    artworkKey: "webAppSecurity",
    contains: ["Web App Security", "How a request moves through an application", "What testing can and cannot prove", 'data-topic-artwork="webAppSecurity"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/de/topics/web-app-security",
    statuses: [200],
    kind: "article",
    artworkKey: "webAppSecurity",
    contains: ["Web App Security", "Wie eine Anfrage durch die Anwendung läuft", "Was Tests belegen können - und was nicht", 'data-topic-artwork="webAppSecurity"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/en/topics/secure-development",
    statuses: [200],
    kind: "article",
    artworkKey: "secureDevelopment",
    contains: ["Secure Development", "A practical secure-development lifecycle", "Example: adding a customer-data export", 'data-topic-artwork="secureDevelopment"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/de/topics/secure-development",
    statuses: [200],
    kind: "article",
    artworkKey: "secureDevelopment",
    contains: ["Sichere Entwicklung", "Ein praktikabler Lebenszyklus für sichere Entwicklung", "Beispiel: Export von Kundendaten", 'data-topic-artwork="secureDevelopment"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/en/topics/penetration-testing",
    statuses: [200],
    kind: "article",
    artworkKey: "pentestPreparation",
    contains: ["Pentest Preparation, explained | niwo", "How a penetration test is prepared and delivered", "Example: scoping a small SaaS application", "Authorization, coordination, and ownership", "NIST SP 800-115", 'data-topic-artwork="pentestPreparation"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  {
    path: "/de/topics/penetration-testing",
    statuses: [200],
    kind: "article",
    artworkKey: "pentestPreparation",
    contains: ["Pentest-Vorbereitung verständlich erklärt | niwo", "So wird ein Penetrationstest vorbereitet und durchgeführt", "Beispiel: Scope für eine kleine SaaS-Anwendung", "Freigabe, Koordination und Verantwortung", "NIST SP 800-115", 'data-topic-artwork="pentestPreparation"'],
    notContains: ["TopicArticles.items."],
    occurrences: [{ needle: "data-topic-artwork=", count: 1 }],
  },
  ...topicDefinitions.flatMap(({ slug }) =>
    locales.map((locale) => ({
      path: `/${locale}/services/${slug}`,
      statuses: [308],
      location: `/${locale}/topics/${slug}`,
    })),
  ),
  { path: "/en/topics/not-a-topic", statuses: [404] },
  { path: "/robots.txt", statuses: [200] },
  {
    path: "/sitemap.xml",
    statuses: [200],
    contains: [
      ...locales.map((locale) => `/${locale}/pages/phishing-lab</loc>`),
      ...locales.map((locale) => `/${locale}/topics</loc>`),
      ...locales.flatMap((locale) =>
        topicDefinitions.map(({ slug }) => `/${locale}/topics/${slug}</loc>`),
      ),
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

  if (!csp.includes("upgrade-insecure-requests")) {
    throw new Error(
      "CSP is missing upgrade-insecure-requests — secure default regressed (was the build run with LOCAL_PREVIEW=1?)",
    );
  }

  const expectedHeaders = {
    "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-origin",
  };

  for (const [name, expectedValue] of Object.entries(expectedHeaders)) {
    const actualValue = response.headers.get(name) ?? "";
    if (actualValue !== expectedValue) {
      throw new Error(
        `${name} is "${actualValue || "(missing)"}", expected "${expectedValue}"`,
      );
    }
  }

  console.log("security headers -> CSP secure default + 7 companion headers present");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readMeta(body, property) {
  return body.match(new RegExp(`<meta[^>]+(?:name|property)="${property}"[^>]+content="([^"]+)"`))?.[1]
    ?? body.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+(?:name|property)="${property}"`))?.[1]
    ?? "";
}

async function checkDiscoverabilityOutput() {
  const sitemap = await (await fetch(`${BASE_URL}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const uniqueUrls = [...new Set(urls)];
  if (uniqueUrls.length !== urls.length) throw new Error("sitemap contains duplicate URLs");
  const titles = new Map();
  const descriptions = new Map();
  const linkedPaths = new Set(["/en", "/de"]);
  const checkedSocialAssets = new Set();

  for (const path of uniqueUrls) {
    const response = await fetch(`${BASE_URL}${path}`);
    const body = await response.text();
    if (response.status !== 200) throw new Error(`${path} from sitemap returned ${response.status}`);
    if (body.length > 700_000) throw new Error(`${path} HTML is ${body.length} bytes; budget is 700000`);
    const title = body.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    const description = readMeta(body, "description");
    const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
    const robots = readMeta(body, "robots");
    const ogTitle = readMeta(body, "og:title");
    const ogDescription = readMeta(body, "og:description");
    const ogUrl = readMeta(body, "og:url");
    const ogImage = readMeta(body, "og:image");
    const twitterCard = readMeta(body, "twitter:card");
    const twitterImage = readMeta(body, "twitter:image");
    const h1Count = (body.match(/<h1(?:\s|>)/g) ?? []).length;
    const jsonLdBlocks = [...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    for (const [, jsonLd] of jsonLdBlocks) {
      try { JSON.parse(jsonLd); } catch (error) { throw new Error(`${path} has invalid JSON-LD: ${error.message}`); }
    }
    for (const [field, value] of Object.entries({ title, description, canonical, robots, ogTitle, ogDescription, ogUrl, ogImage, twitterCard, twitterImage })) if (!value) throw new Error(`${path} is missing metadata field ${field}`);
    for (const assetUrl of [ogImage, twitterImage]) {
      const assetPath = new URL(assetUrl).pathname;
      if (!checkedSocialAssets.has(assetPath)) {
        const assetResponse = await fetch(`${BASE_URL}${assetPath}`);
        if (assetResponse.status !== 200 || !assetResponse.headers.get("content-type")?.startsWith("image/")) throw new Error(`${path} social asset ${assetPath} is not a reachable image`);
        checkedSocialAssets.add(assetPath);
      }
    }
    if (!canonical.endsWith(path) || !ogUrl.endsWith(path)) throw new Error(`${path} has inconsistent canonical/og:url`);
    for (const locale of ["en", "de"]) if (!body.match(new RegExp(`hrefLang="${locale}" href="[^"]+\/${locale}${path.replace(/^\/(?:en|de)/, "")}"`))) throw new Error(`${path} is missing ${locale} hreflang`);
    if (!body.includes('hrefLang="x-default"')) throw new Error(`${path} is missing x-default hreflang`);
    if (h1Count !== 1) throw new Error(`${path} has ${h1Count} h1 elements`);
    if (titles.has(title)) throw new Error(`${path} duplicates title used by ${titles.get(title)}: ${title}`);
    if (descriptions.has(description)) throw new Error(`${path} duplicates description used by ${descriptions.get(description)}`);
    titles.set(title, path); descriptions.set(description, path);
    for (const match of body.matchAll(/href="(\/(?:en|de)\/[^"]*)"/g)) linkedPaths.add(match[1].split("#")[0]);
    if (path.includes("/services/") && !body.includes('"@type":"Service"')) throw new Error(`${path} is missing Service structured data`);
    if (path.includes("/insights/") && (!body.includes("dateModified") || !body.includes('id="limitations"'))) throw new Error(`${path} is missing visible evidence fields or Article schema`);
    if ((path === "/en" || path === "/de") && !body.includes("data-niwo-identity")) throw new Error(`${path} is missing the rendered NIWO identity statement`);
    if (/<img(?![^>]*\balt=)[^>]*>/i.test(body)) throw new Error(`${path} contains an image without alt`);
  }
  const orphans = uniqueUrls.filter((path) => !linkedPaths.has(path) && !/\/pages\/(privacy-policy|imprint|vdp)$/.test(path));
  if (orphans.length) throw new Error(`orphan sitemap routes: ${orphans.join(", ")}`);
  const robotsText = await (await fetch(`${BASE_URL}/robots.txt`)).text();
  for (const expected of ["Googlebot", "Bingbot", "OAI-SearchBot", "GPTBot", "ChatGPT-User"]) if (!robotsText.includes(`User-Agent: ${expected}`)) throw new Error(`robots.txt is missing ${expected}`);
  if (!/User-Agent: GPTBot[\s\S]*?Disallow: \//.test(robotsText)) throw new Error("GPTBot training opt-out is missing");
  console.log(`discoverability -> ${uniqueUrls.length} sitemap routes have unique metadata, canonical/locale parity, one h1, link coverage, structured content, and HTML budgets`);
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
  kind,
  artworkKey,
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

  if (contains?.length || notContains?.length || occurrences?.length || ordered?.length || kind) {
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

    if (kind === "index" || kind === "article") {
      const canonicalHref = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
      if (!canonicalHref.endsWith(path)) {
        throw new Error(`${path} has canonical "${canonicalHref || "(missing)"}"`);
      }

      const routeSuffix = path.replace(/^\/(?:en|de)/, "");
      for (const locale of locales) {
        const alternateHref = body.match(
          new RegExp(`hrefLang="${locale}" href="([^"]+)"`),
        )?.[1] ?? "";
        if (!alternateHref.endsWith(`/${locale}${routeSuffix}`)) {
          throw new Error(
            `${path} has ${locale} alternate "${alternateHref || "(missing)"}"`,
          );
        }
      }
    }

    if (kind === "index") {
      const h1Count = (body.match(/<h1(?:\s|>)/g) ?? []).length;
      const h2Count = (body.match(/<h2(?:\s|>)/g) ?? []).length;
      if (h1Count !== 1 || h2Count !== topicDefinitions.length) {
        throw new Error(
          `${path} has ${h1Count} h1 and ${h2Count} h2 elements, expected 1 and ${topicDefinitions.length}`,
        );
      }

      const locale = path.split("/")[1];
      for (const { slug } of topicDefinitions) {
        const href = `href="/${locale}/topics/${slug}"`;
        if (!body.includes(href)) {
          throw new Error(`${path} is missing topic index href ${href}`);
        }
      }
    }

    if (kind === "article") {
      const h1Count = (body.match(/<h1(?:\s|>)/g) ?? []).length;
      const artworkCount = (body.match(/data-topic-artwork=/g) ?? []).length;
      if (h1Count !== 1 || artworkCount !== 1) {
        throw new Error(
          `${path} has ${h1Count} h1 and ${artworkCount} artwork hooks, expected one each`,
        );
      }
      if (!body.includes(`data-topic-artwork="${artworkKey}"`)) {
        throw new Error(`${path} is missing artwork ${artworkKey}`);
      }

      const sourceTargets = (body.match(/target="_blank"/g) ?? []).length;
      const safeSourceRels = (body.match(/rel="noopener noreferrer"/g) ?? []).length;
      if (sourceTargets < 3 || sourceTargets !== safeSourceRels) {
        throw new Error(
          `${path} has ${sourceTargets} external source targets and ${safeSourceRels} safe rel attributes`,
        );
      }

      const [, locale, , currentSlug] = path.split("/");
      for (const { slug } of topicDefinitions) {
        if (slug === currentSlug) continue;
        const relatedHref = `href="/${locale}/topics/${slug}"`;
        const relatedCount = body.split(relatedHref).length - 1;
        if (relatedCount < 2) {
          throw new Error(
            `${path} does not expose ${relatedHref} in both navigation and related topics`,
          );
        }
      }
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
  await checkDiscoverabilityOutput();
} finally {
  server.kill();
}
