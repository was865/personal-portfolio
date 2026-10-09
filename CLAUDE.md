# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (see `pnpm-lock.yaml`).

- `pnpm dev` — start Next.js dev server (Turbopack is the default in Next.js 16)
- `pnpm build` — production build, runs with `--webpack` because `next-pwa` injects a webpack config (Turbopack would reject it). Required to exercise service worker generation; PWA is disabled in dev.
- `pnpm start` — serve the production build
- `pnpm lint` — ESLint flat config via `eslint .` (`next lint` was removed in Next.js 16)

There is no test suite configured in this repo.

## Required env vars

`.env.local` (see [.env.example](.env.example)):
- `NOTION_TOKEN` — internal integration secret. The integration must be connected to the "Blog Posts" database.
- `NOTION_BLOG_DATA_SOURCE_ID` — data source ID of that database.
- `NOTION_WEBHOOK_VERIFICATION_TOKEN` — optional; enables `/api/revalidate` for Notion webhooks.
- `NOTION_API_BASE_URL` — optional; points the client at a mock server for local testing.

Blog routes throw at request time if the first two are missing (see [lib/notion/client.ts](lib/notion/client.ts)).

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 portfolio. Three concerns are worth understanding before editing:

### Locale-prefixed routing

All user-facing routes live under `app/[locale]/…`. Supported locales are defined once in [i18n/routing.ts](i18n/routing.ts) (`en`, `zh`, `ja`, default `en`) and referenced from:
- [proxy.ts](proxy.ts) — Next.js 16 renamed `middleware.ts` to `proxy.ts` (runtime is `nodejs`, not `edge`). Matcher is hard-coded to `['/', '/(zh|en|ja)/:path*']`; **update the matcher regex when adding a locale**, not just `routing.ts`.
- [i18n/request.ts](i18n/request.ts) — loads `messages/{locale}.json` per request.
- [app/[locale]/layout.tsx](app/[locale]/layout.tsx) — picks a locale-specific font (`fontNotoSansJP` / `fontNotoSansSC`) and wraps the tree in `NextIntlClientProvider`.

Translations live in [messages/en.json](messages/en.json), `ja.json`, `zh.json`. Keep all three in sync when adding a key — there is no fallback to English at the key level.

### Notion as CMS

The blog reads a Notion **database** ("Blog Posts") through the **official API** (`@notionhq/client`). Do not reintroduce `notion-client` / `react-notion-x` (unofficial API: 100-block chunk limit, UA-based 403s, response-shape changes).

- [lib/notion/posts.ts](lib/notion/posts.ts) — `getPublishedPosts()` queries rows with `Status = Published`, sorted by `Published` date. Property names live in `PROP`; Title has no tags (tags are the `Tags` multi-select, language is the `Language` select). `Translations` relations are made symmetric in code.
- [lib/notion/blocks.ts](lib/notion/blocks.ts) — `getPageBlocks()` fetches the full block tree (paginated, recursive, concurrency-limited to respect the 3 req/s limit), plus TOC / reading-time helpers.
- [components/notion/NotionBlocks.tsx](components/notion/NotionBlocks.tsx) — server-side renderer for the block types; styles are the `n-*` classes under `.post-body` in `app/globals.css`. Code is highlighted server-side with Prism ([lib/notion/highlight.ts](lib/notion/highlight.ts)). Add new block types there.
- Notion-hosted files have signed URLs that expire in 1 hour, so HTML points at [app/api/notion-asset/[kind]/[id]/route.ts](app/api/notion-asset/[kind]/[id]/route.ts), which re-signs and streams with CDN caching.
- Caching: the list is ISR (`revalidate = 60`), posts `revalidate = 300`; [app/api/revalidate/route.ts](app/api/revalidate/route.ts) handles signed Notion webhooks to purge immediately. Pages call `setRequestLocale` so next-intl doesn't read headers (which would make them dynamic).
- Post URLs are `/{locale}/blog/{notionPageId}`; links between posts inside Notion are rewritten to these, links to non-public Notion pages are dropped.

### Server vs client boundaries

- [lib/utils-server.ts](lib/utils-server.ts) is server-only (uses `fs`, `next/headers`). It reads `public/images/photos/` at request time for `getRandomPhotos` and parses the UA for `isMobileDevice`. Do not import this from client components.
- Section-scroll state lives in [context/action-section-context.tsx](context/action-section-context.tsx); theme state in [context/theme-context.tsx](context/theme-context.tsx) (also uses `next-themes` elsewhere). Both providers wrap the tree in the locale layout.
- The home page ([app/[locale]/page.tsx](app/[locale]/page.tsx)) is a Server Component that hydrates `AboutArea` with a server-picked random photo set — images are selected per request, not per client.

### Other conventions

- Path alias `@/*` maps to the repo root (see [tsconfig.json](tsconfig.json)).
- Tailwind v4 is configured via `@tailwindcss/postcss` in [postcss.config.js](postcss.config.js) and `app/globals.css` — there is **no `tailwind.config.ts`** despite what `components.json` implies.
- PWA is wired through `next-pwa` in [next.config.js](next.config.js); the service worker is only emitted on `next build`. The manifest is referenced from `metadata.manifest` in the locale layout.
- `react-icon-cloud`, `gsap`, `motion`, and `react-grid-layout` are all in use — prefer extending existing animation/layout patterns rather than adding another library.
