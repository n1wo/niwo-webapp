# niwo-webapp

[![Site](https://img.shields.io/badge/site-niwosystems.com-6b6ff5)](https://www.niwosystems.com)
![Next.js](https://img.shields.io/github/package-json/dependency-version/n1wo/niwo-webapp/next?filename=frontend/package.json&label=Next.js&logo=nextdotjs&color=black)
![React](https://img.shields.io/github/package-json/dependency-version/n1wo/niwo-webapp/react?filename=frontend/package.json&label=React&logo=react&logoColor=111&color=61DAFB)
![TypeScript](https://img.shields.io/github/package-json/dependency-version/n1wo/niwo-webapp/dev/typescript?filename=frontend/package.json&label=TypeScript&logo=typescript&logoColor=white&color=3178C6)
![Tailwind CSS](https://img.shields.io/github/package-json/dependency-version/n1wo/niwo-webapp/dev/tailwindcss?filename=frontend/package.json&label=Tailwind%20CSS&logo=tailwindcss&logoColor=white&color=38B2AC)
![i18n](https://img.shields.io/badge/i18n-EN%20%2F%20DE-6b6ff5)
![License](https://img.shields.io/badge/license-MIT-green)
![Scope](https://img.shields.io/badge/scope-public_website-orange)

Public website for [niwo systems](https://www.niwosystems.com), a small cybersecurity-focused practice by Nikita Wokurka. The site is built around practical web application security, secure development, pentest preparation, research notes, and future writing about cybersecurity projects and learning.

This repository is public for transparency, technical credibility, and easier inspection of how the site is built. It is the production-facing website codebase for a security-focused independent practice, not a generic starter or white-label brand package.

## Site Scope

- Bilingual public site in English and German
- Homepage with consulting and research positioning
- Service pages for web application security review, security guidance, and pentest preparation
- About page for background, focus, and working style
- Vulnerability Disclosure Policy, privacy policy, imprint, sitemap, robots.txt, and security.txt
- Space for future research, academic writing, project notes, and blog-style updates

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- next-intl

## Repository Layout

```text
frontend/        Next.js application
frontend/src/    App routes, components, i18n, messages, and site styling
docs/            Project notes, audits, and context documents
```

## Local Development

Requirements:

- Node.js 20+
- npm 10+

Run locally:

```bash
cd frontend
npm ci
npm run dev
```

Default local URL:

```bash
http://localhost:3000
```

Useful commands:

```bash
npm run lint
npm run build
```

## Project Notes

- Current site direction: [docs/site-context-redesign.md](./docs/site-context-redesign.md)
- Brand and reuse note: [NOTICE.md](./NOTICE.md)

## Deployment

The live site is deployed from this repository. Production updates are built from `main`.

## License

The source code in this repository is available under the [MIT License](./LICENSE).

## Brand And Content Usage

Code reuse is allowed under MIT. The niwo systems name, logos, written copy, business positioning, and site-specific visual identity are not intended for unrestricted reuse as your own brand or commercial identity.

See [NOTICE.md](./NOTICE.md) for the concise usage note.
