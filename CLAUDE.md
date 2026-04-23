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

`.env.local`:
- `NEXT_PUBLIC_NOTION_BLOG_PARENT_ID` — ID of the Notion page that is the parent of all blog posts. The blog list/detail routes throw at request time if this is missing (see [app/[locale]/blog/page.tsx](app/[locale]/blog/page.tsx) and [config/site.ts](config/site.ts)).

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 portfolio. Three concerns are worth understanding before editing:

### Locale-prefixed routing

All user-facing routes live under `app/[locale]/…`. Supported locales are defined once in [i18n/routing.ts](i18n/routing.ts) (`en`, `zh`, `ja`, default `en`) and referenced from:
- [proxy.ts](proxy.ts) — Next.js 16 renamed `middleware.ts` to `proxy.ts` (runtime is `nodejs`, not `edge`). Matcher is hard-coded to `['/', '/(zh|en|ja)/:path*']`; **update the matcher regex when adding a locale**, not just `routing.ts`.
- [i18n/request.ts](i18n/request.ts) — loads `messages/{locale}.json` per request.
- [app/[locale]/layout.tsx](app/[locale]/layout.tsx) — picks a locale-specific font (`fontNotoSansJP` / `fontNotoSansSC`) and wraps the tree in `NextIntlClientProvider`.

Translations live in [messages/en.json](messages/en.json), `ja.json`, `zh.json`. Keep all three in sync when adding a key — there is no fallback to English at the key level.

### Notion as CMS

The blog is powered by `notion-client` / `react-notion-x`, not a database. [lib/notion.ts](lib/notion.ts) does three things:
1. `getAllBlogPosts(parentId)` walks `recordMap.block`, filters to `type === 'page'` children of the configured parent, and sorts by `created_time` descending.
2. `getPageContent(pageId)` fetches a single post's `recordMap` for render by `react-notion-x`.
3. `customMapImageUrl` rewrites Notion S3 URLs through `www.notion.so/image/...` so they work with Next's `<Image>`. `next.config.js` whitelists `www.notion.so`, `images.unsplash.com`, `firebasestorage.googleapis.com`, and `raw.githubusercontent.com` as remote image hosts.

Blog titles use an in-title tag convention `"Post title [tag1, tag2]"`. `extractTags` / `getTitleWithoutTags` in [lib/utils.ts](lib/utils.ts) parse them — don't hand-parse tags elsewhere.

`revalidate = 0` on [app/[locale]/blog/page.tsx](app/[locale]/blog/page.tsx) disables caching for the blog list; posts are always fetched fresh from Notion.

### Server vs client boundaries

- [lib/utils-server.ts](lib/utils-server.ts) is server-only (uses `fs`, `next/headers`). It reads `public/images/photos/` at request time for `getRandomPhotos` and parses the UA for `isMobileDevice`. Do not import this from client components.
- Section-scroll state lives in [context/action-section-context.tsx](context/action-section-context.tsx); theme state in [context/theme-context.tsx](context/theme-context.tsx) (also uses `next-themes` elsewhere). Both providers wrap the tree in the locale layout.
- The home page ([app/[locale]/page.tsx](app/[locale]/page.tsx)) is a Server Component that hydrates `AboutArea` with a server-picked random photo set — images are selected per request, not per client.

### Other conventions

- Path alias `@/*` maps to the repo root (see [tsconfig.json](tsconfig.json)).
- Tailwind v4 is configured via `@tailwindcss/postcss` in [postcss.config.js](postcss.config.js) and `app/globals.css` — there is **no `tailwind.config.ts`** despite what `components.json` implies.
- PWA is wired through `next-pwa` in [next.config.js](next.config.js); the service worker is only emitted on `next build`. The manifest is referenced from `metadata.manifest` in the locale layout.
- `react-icon-cloud`, `gsap`, `motion`, and `react-grid-layout` are all in use — prefer extending existing animation/layout patterns rather than adding another library.
