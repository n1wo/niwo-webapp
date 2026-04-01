# AGENTS.md

This file is the repo-local operating guide for agents working on `niwo-webapp`.
It should help an agent make changes that fit the site, the codebase, and the
owner's expectations without needing to rediscover the same rules every time.

## Purpose

`niwo-webapp` is the public website for Niwo Systems. The site is not a generic
marketing template. It has a specific voice and a specific visual language:

- dark, restrained, terminal-inspired
- security-first, practical, clear
- modern but not flashy for the sake of it
- concise and credible rather than inflated

Agents should optimize for consistency with that identity.

## Source Of Truth

When documents disagree, use this order:

1. This `AGENTS.md`
2. Current code in `frontend/src/`
3. `frontend/package.json`
4. Root `README.md`

Notes:

- The root `README.md` may drift from the actual app state.
- Prefer the live code and `frontend/package.json` over README claims about
  framework versions or deployment details.

## Working Directory And Commands

Most work happens in `frontend/`.

Run app commands from:

- `C:\Users\nikit\OneDrive\Documents\GitHub\niwo-webapp\frontend`

Primary commands:

- `npm run dev`
- `npm run lint`
- `npm run build`

Expected validation:

- Run `npm run lint` after meaningful code changes.
- Run `npm run build` when changes affect routing, layouts, localized pages,
  shared components, or anything that could break rendering across routes.
- If you cannot run a validation step, say so explicitly.

## Repo Map

- `frontend/src/app/`
  App Router entrypoints
- `frontend/src/app/[locale]/`
  Localized routes for the real site
- `frontend/src/components/`
  Reusable UI building blocks
- `frontend/src/components/home/HomePage.tsx`
  Canonical visual reference for the site's main design language
- `frontend/src/components/common/`
  Shared cross-page components; prefer adding shared primitives here instead of
  duplicating UI patterns
- `frontend/src/components/legal/LegalPageLayout.tsx`
  Shared layout for legal pages
- `frontend/src/components/services/`
  Service cards and service visuals
- `frontend/src/data/services.ts`
  Canonical service registry and slug map
- `frontend/src/i18n/`
  `next-intl` routing, navigation, metadata helpers
- `frontend/src/messages/en.json`
  English copy
- `frontend/src/messages/de.json`
  German copy
- `frontend/src/app/globals.css`
  Design tokens, fonts, and reusable CSS behaviors

## Architecture Rules

### Localization

The site uses `next-intl` with locale-prefixed routes.

- Supported locales are `en` and `de`.
- Route prefixes are always present.
- If you change user-facing copy, update both locales unless the user explicitly
  asks for one locale only.
- Keep translation keys structurally aligned across `en.json` and `de.json`.
- Prefer editing existing keys over inventing new ones when the content shape is
  unchanged.

### Services

Service pages are driven by both the service registry and message content.

If you add, rename, or remove a service, check all of these:

- `frontend/src/data/services.ts`
- `frontend/src/messages/en.json`
- `frontend/src/messages/de.json`
- `frontend/src/app/[locale]/services/[slug]/page.tsx`
- any related shared cards or navigation references

Do not update service copy in only one place and assume the rest will follow.

### Shared UI

Before creating a new one-off component or button style, check whether the
pattern should be shared instead.

Current examples:

- `frontend/src/components/common/PrimarySecondaryCta.tsx`
- `frontend/src/components/legal/LegalPageLayout.tsx`
- `frontend/src/components/services/ServiceCard.tsx`

If the same pattern appears on the homepage and another page, prefer a shared
component.

## Design Rules

### Visual Direction

Preserve the established visual language:

- near-black backgrounds
- subtle borders and layered surfaces
- restrained accent usage
- terminal-inspired details
- IBM Plex Mono for technical or emphasized UI moments
- Inter for body copy

Use the design tokens in `frontend/src/app/globals.css` instead of inventing
new colors or ad hoc shadows when the existing system already covers the need.

### Homepage As Reference

Treat `frontend/src/components/home/HomePage.tsx` as the best reference for the
current brand direction.

Other pages should feel related to it in:

- section spacing
- border/surface treatment
- typography hierarchy
- CTA styling
- motion tone

Do not make subpages look like they belong to a different site unless the user
explicitly asks for a redesign.

### Typography

Use typography intentionally:

- `font-mono` for hero headings, technical labels, section eyebrows, navigation,
  and other "system" moments
- sans body text for readability unless there is a clear visual reason not to
- avoid generic oversized bold headings that lose the site's more deliberate tone

### Motion

Motion should be subtle and purposeful.

- Respect reduced-motion handling already present in the site.
- Reuse the existing motion cadence before adding new animation patterns.
- Avoid decorative motion that competes with the content.

## Copy Rules

The site's copy should sound:

- practical
- security-literate
- calm
- direct
- credible

Avoid:

- vague startup buzzwords
- exaggerated claims
- generic agency language
- filler CTAs like "Work With Me" when a more specific action is possible

Prefer CTAs and headings that match the page context. A service page CTA should
name the likely next action for that service.

## Editing Translation Files

Be careful in `frontend/src/messages/*.json`.

- Preserve JSON structure and key order unless there is a good reason to change it.
- Make narrow edits.
- Avoid mass reformatting or broad rewrites.
- PowerShell output may display some German characters oddly; verify by diff and
  by targeted search instead of assuming the file is broken.
- Do not accidentally re-encode the file or replace punctuation globally.

## Known Drift And Gotchas

- The root `README.md` mentions Next.js 16, but `frontend/package.json` is the
  better source of truth for the current runtime.
- Some PowerShell output may show German text with mojibake even when the file
  itself is still usable; edit carefully.
- The repo may contain uncommitted user changes. Do not revert unrelated work.

## Safe Change Strategy

When making changes:

1. Read the relevant component and its adjacent shared components first.
2. Check whether the same pattern already exists somewhere else in the site.
3. Reuse the shared pattern if it exists.
4. Update both locales for user-facing copy unless told otherwise.
5. Run `npm run lint`.
6. Run `npm run build` for broader UI or routing changes.

Prefer small, reversible changes over broad stylistic rewrites.

## Commit And Push Behavior

- Do not commit unless the user asks.
- Do not push unless the user asks.
- If the tree is dirty, isolate your changes and avoid touching unrelated files.

## What Good Looks Like

A successful change in this repo:

- fits the homepage visual language
- preserves locale parity where appropriate
- reuses shared UI instead of duplicating patterns
- keeps copy specific and believable
- passes lint, and build when relevant
- leaves the repo easier for the next agent to understand

If uncertain, choose the option that is simpler, more consistent, and easier to
reuse.
