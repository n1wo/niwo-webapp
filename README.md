# niwo-webapp

Frontend for **Niwo Systems**, built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

This repository contains the main public-facing web application for **niwosystems.com**.

---

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **AWS Amplify**
- **CloudFront**
- **Cloudflare**

---

## Features

- Modern App Router architecture
- Responsive, terminal-inspired UI
- Type-safe frontend development
- Utility-first styling with Tailwind CSS
- Motion and interaction support with Framer Motion
- Production deployment via AWS Amplify
- Global delivery through CloudFront and Cloudflare

---

## Project Structure

```bash
niwo-webapp/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── hooks/
│   ├── package.json
│   └── ...
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **npm 10+**

### Install

```bash
git clone https://github.com/n1wo/niwo-webapp.git
cd niwo-webapp/frontend
npm ci
```

### Run locally

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run lint checks
```

---

## Deployment

This project is deployed through **AWS Amplify**.

### Deployment flow

- Push changes to `main`
- Amplify builds and deploys automatically
- Content is delivered globally via **CloudFront**
- Domain and DNS are managed through **Cloudflare**

---

## Security

- HTTPS enabled in production
- SSL managed through AWS / CloudFront
- Built with a security-conscious frontend architecture

---

## License

This project is licensed under the **GPL-3.0 License**.  
See the [`LICENSE`](./LICENSE) file for details.

---

## Links

- 🌐 Website: [niwosystems.com](https://www.niwosystems.com)
- 💻 GitHub: [n1wo](https://github.com/n1wo)