# WEB-30 Discoverability Baseline

Date: 2026-07-12  
Baseline commit: `b42b8a1`  
Production origin: `https://www.niwosystems.com`

## Business comparison baseline

NIWO is a founder-led software, IT, and cybersecurity consulting practice. It serves startups, SMEs, and individuals with practical guidance, carefully scoped reviews, and responsible technology adoption. Initial incident help is free digital orientation; it is not a 24/7 hotline, forensic laboratory, legal service, managed-response retainer, or recovery guarantee.

Drift categories: `personal-portfolio`, `student/job-search`, `learning-project`, `m365-only`, `ai-only`, `incident-overclaim`, `unsupported-service`, `identity/contact`, and `de-en-mismatch`.

## Initial implementation inventory

| System | Baseline state |
|---|---|
| Metadata | `buildMetadata` supplies title, description, canonical, DE/EN alternates, OG, and Twitter for every content route. No `x-default`; social alt is English and stale. |
| Canonical and locale routing | Mandatory `/en` and `/de`; `/` redirects to `/en`. Canonicals and alternates are generated, but no explicit `x-default`. |
| Sitemap | Includes all 26 indexable localized content routes. `lastModified` is request time rather than content time. |
| Robots | Generic allow-all rule with private/API/framework prefixes blocked; no explicit search/AI crawler policy. |
| Structured data | Six topic pages have `TechArticle` and `BreadcrumbList`; no shared entity identity or Service schema. |
| Social assets | One English-only generated image, with old web-security-only positioning and personal footer. |
| Icons/manifest | SVG favicon exists; no web app manifest. |
| Analytics/consent | No analytics code or consent layer. Privacy copy explicitly states that non-essential tracking is not used. |
| Hosting/security | AWS Amplify standalone deployment notes; application CSP, HSTS, Referrer-Policy, COOP/CORP, Permissions-Policy, and frame/content-type controls. No repository CDN/WAF bot rule configuration. |
| CI | Lint and production route/build checks. No active unit, metadata, accessibility, or performance scripts. |

## Route scan matrix

Each `{en,de}` row represents both concrete localized URLs and was checked in both languages. All initial indexable routes inherited the same OG/Twitter image and had `index,follow` by default.

| Routes | Purpose and metadata source | Initial finding | Severity | Owner |
|---|---|---|---|---|
| `/en`, `/de` | Home; `Home.metadata` | Current business title exists; visible purpose lacks explicit founder-led operating context and machine-readable entity identity. | High | WEB-31, WEB-34, WEB-45 |
| `/{en,de}/pages/about` | About; `About.metadata` | EN metadata and visible content retain student/job-search and recruiter framing. | High | WEB-31, WEB-45 |
| `/{en,de}/pages/phishing-lab` | Interactive project/lab; route-local metadata | Unique metadata; descriptions are long and promotional. Essential lab context is rendered, but interaction needs accessibility/performance verification. | Medium | WEB-31, WEB-49 |
| `/{en,de}/pages/privacy-policy` | Legal; `PrivacyPolicy.metadata` | Unique and descriptive. Must remain non-marketing and aligned with any analytics decision. | Low | WEB-31, WEB-50 |
| `/{en,de}/pages/vdp` | Security policy; `Vdp.metadata` | EN description says “niwo security team,” overstating founder-led operating context. | High | WEB-31, WEB-34 |
| `/{en,de}/pages/imprint` | Legal/operator identity; `Imprint.metadata` | Unique metadata and visible operator details; use as identity consistency reference. | Low | WEB-31, WEB-34 |
| `/{en,de}/topics` | Educational hub; `TopicArticles.index.metadata` | Unique and accurate; all six articles linked in crawlable HTML. | Low | WEB-31, WEB-47 |
| `/{en,de}/topics/web-app-security` | Educational article; translation data + generated metadata | Unique metadata, visible sources, Article/Breadcrumb schema. | Low | WEB-31, WEB-34, WEB-47 |
| `/{en,de}/topics/secure-development` | Educational article; translation data + generated metadata | Unique metadata, visible sources, Article/Breadcrumb schema. | Low | WEB-31, WEB-34, WEB-47 |
| `/{en,de}/topics/penetration-testing` | Educational article; translation data + generated metadata | Unique educational intent; must not imply a mature unrestricted pentest offer. | Medium | WEB-31, WEB-47 |
| `/{en,de}/topics/ai-in-devsecops` | Educational article; translation data + generated metadata | Unique metadata; connected to topics but no high-intent service distinction. | Medium | WEB-31, WEB-46, WEB-47 |
| `/{en,de}/topics/agentic-engineering` | Educational article; translation data + generated metadata | Unique metadata; must remain security-first and avoid autonomous-agent overclaim. | Medium | WEB-31, WEB-46, WEB-47 |
| `/{en,de}/topics/incident-response` | Educational article; translation data + generated metadata | Unique educational metadata; no dedicated first-guidance service page and social fallback can over-broaden the offer. | High | WEB-31, WEB-32, WEB-46 |
| `/{en,de}/services/{six-topic-slugs}` | Legacy compatibility redirects | All permanently redirect to matching topic pages. They are not indexable service pages and should remain compatibility-only. | Info | WEB-33 |
| `/` | Default-locale redirect | `307` to `/en`; intentional. | Info | WEB-33 |
| `/robots.txt` | Generated robots policy | Search/AI crawler decisions not explicit. | High | WEB-33, WEB-44 |
| `/sitemap.xml` | Generated sitemap | Covers the initial 26 localized content URLs; must expand with approved service/evidence routes. | High | WEB-33, WEB-46, WEB-48 |
| `/opengraph-image`, `/twitter-image` | Generated social assets | Production-accessible but stale, English-only positioning. | High | WEB-32 |
| `/.well-known/security.txt` | Public security contact | Present and route-tested. | Low | WEB-33 |
| localized and root not-found | Error UI | Localized content exists; intentionally excluded from sitemap and should remain `404`. | Low | WEB-33 |

## Initial validation

- `npm.cmd run lint` — passed.
- `npm.cmd run check:routes` — passed; Next.js 16.2.10 production build generated 34 static pages and all initial route/status/content/header assertions passed.

Update this file when the public route registry or positioning changes. Automated checks use `src/data/siteRoutes.ts` as the executable route baseline; this document preserves the human-reviewed starting state and ownership rationale.

