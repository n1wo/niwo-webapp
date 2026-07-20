# Search and AI Crawler Policy

## Decision

| Agent | Public content | Training/search purpose |
|---|---|---|
| Googlebot | Allow | Traditional search indexing. |
| Bingbot | Allow | Bing indexing and related search experiences. |
| OAI-SearchBot | Allow | ChatGPT search visibility. |
| GPTBot | Disallow | NIWO opts public site content out of model-training crawl while keeping search visibility independent. |
| ChatGPT-User | Allow | Support user-initiated retrieval; OpenAI notes that `robots.txt` may not apply to these requests. |
| Other agents | Allow public routes; block non-public prefixes | Default web policy. |

All agents remain blocked from `/api/`, `/admin/`, `/_next/`, and `/private/`. A user-agent string is not proof of crawler identity. Hosting, WAF, CDN, or rate-limit exceptions must use the provider's verified IP/rDNS mechanism and must never weaken controls globally.

## Evidence

OpenAI documents OAI-SearchBot, GPTBot, and ChatGPT-User as separate controls and publishes crawler IP ranges:

- https://developers.openai.com/api/docs/bots
- https://openai.com/searchbot.json
- https://openai.com/gptbot.json
- https://openai.com/chatgpt-user.json

Allowing a crawler does not guarantee indexing, ranking, citation, recommendation, or a successful user-initiated fetch.

## Verification

Run `npm run check:discoverability` against generated output. For production, run `node scripts/check-crawlers.mjs https://www.niwosystems.com`. Record status, redirect, robots response, canonical, and whether meaningful rendered content is present for representative EN/DE home, topic, and service routes.

If AWS Amplify, CloudFront, or another protection layer changes, review challenge pages, bot controls, rate limits, redirects, and the published IP ranges before changing this policy.

