🧩 niwo-webapp

niwo-webapp is a modern, high-performance web application built with Next.js 16 (App Router), designed for speed, security, and scalability.
It serves as the main frontend interface for Niwo Systems, leveraging AWS Amplify and Cloudflare for global delivery.

🚀 Features

Next.js 16.0.0-beta (App Router) — Fast, hybrid rendering with Turbopack.

React 19 (experimental) — Cutting-edge React features.

TypeScript — Type-safe and maintainable code.

Tailwind CSS — Utility-first, theme-driven design system.

Framer Motion — Smooth, composable animations.

AWS Amplify + CloudFront — Continuous deployment and CDN edge delivery.

Cloudflare DNS — Secure DNS and email routing (ProtonMail integration).

🧱 Tech Stack
Layer	Technology	Notes
Framework	Next.js 16 (App Router)	Static pre-rendering, Turbopack dev
Language	TypeScript	Strict mode enabled
Styling	Tailwind CSS	Global tokens and light/dark themes
Deployment	AWS Amplify	Git-based CI/CD with CloudFront CDN
DNS	Cloudflare	Managed domain and SSL routing

⚙️ Development
🧩 Prerequisites

Node.js 20.x

npm 10.x or later

VS Code with TypeScript + Tailwind IntelliSense

🏗️ Setup
git clone https://github.com/n1wo/niwo-webapp.git
cd niwo-webapp/frontend
npm ci
npm run dev


Then open http://localhost:3000
 in your browser.

🔒 Security

All routes served over HTTPS

Amplify-managed SSL via CloudFront

🌐 Deployment

The app is deployed automatically via AWS Amplify when changes are pushed to the main branch.
Build command: npm run build
Output directory: .next/

Amplify handles:

Continuous deployment from GitHub

CDN caching via CloudFront

SSL certificate management

🧩 License

This project is licensed under the GNU License.
See the LICENSE
 file for details.

Niwo Systems
🌐 niwosystems.com
