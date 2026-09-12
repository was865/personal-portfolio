# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (see `pnpm-lock.yaml`).

- `pnpm dev` — start Next.js dev server (Turbopack is the default in Next.js 16)
- `pnpm build` — production build, runs with `--webpack` because `next-pwa` injects a webpack config (Turbopack would reject it). Required to exercise service worker generation; PWA is disabled in dev.
- `pnpm start` — serve the production build
- `pnpm lint` — ESLint flat config via `eslint .` (`next lint` was removed in Next.js 16)

- `pnpm test` — vitest（`lib/**/*.test.ts` と `config/**/*.test.ts`）。CMS のロジックだけを対象にしている
- `pnpm cms <command>` — CMS の管理 API を叩く CLI（`scripts/cms.mjs`）

## Required env vars

`.env.local`:
- `NEXT_PUBLIC_NOTION_BLOG_PARENT_ID` — ID of the Notion page that is the parent of all blog posts. The blog list/detail routes throw at request time if this is missing (see [app/[locale]/blog/page.tsx](app/[locale]/blog/page.tsx) and [config/site.ts](config/site.ts)).

CMS（手順は [docs/cms-setup.md](docs/cms-setup.md)）:
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob。ストアを Connect すると自動で入る。**未設定でもサイトは動く**（`content/*.json` を表示する）が、保存はできない
- `CMS_SESSION_SECRET` — 管理画面セッション JWT の署名鍵（32 文字以上）
- `CMS_ADMIN_PASSWORD_HASH` — `pnpm cms hash-password '<password>'` の出力。区切りは `:`（`$` は env ローダに展開される）
- `CMS_SERVICE_TOKEN` — Claude が `X-Service-Token` で送る鍵

## Architecture

Next.js 16 App Router + React 19 + Tailwind v4 portfolio. Three concerns are worth understanding before editing:

### Locale-prefixed routing

All user-facing routes live under `app/[locale]/…`. Supported locales are defined once in [i18n/routing.ts](i18n/routing.ts) (`en`, `zh`, `ja`, default `en`) and referenced from:
- [proxy.ts](proxy.ts) — Next.js 16 renamed `middleware.ts` to `proxy.ts` (runtime is `nodejs`, not `edge`). Matcher is hard-coded to `['/', '/(zh|en|ja)/:path*']`; **update the matcher regex when adding a locale**, not just `routing.ts`.
- [i18n/request.ts](i18n/request.ts) — loads `messages/{locale}.json` per request.
- [app/[locale]/layout.tsx](app/[locale]/layout.tsx) — picks a locale-specific font (`fontNotoSansJP` / `fontNotoSansSC`) and wraps the tree in `NextIntlClientProvider`.

Translations live in [messages/en.json](messages/en.json), `ja.json`, `zh.json`. Keep all three in sync when adding a key — there is no fallback to English at the key level.

### Notion as blog CMS

The blog is powered by `notion-client` / `react-notion-x`, not a database. [lib/notion.ts](lib/notion.ts) does three things:
1. `getAllBlogPosts(parentId)` walks `recordMap.block`, filters to `type === 'page'` children of the configured parent, and sorts by `created_time` descending.
2. `getPageContent(pageId)` fetches a single post's `recordMap` for render by `react-notion-x`.
3. `customMapImageUrl` rewrites Notion S3 URLs through `www.notion.so/image/...` so they work with Next's `<Image>`. `next.config.js` whitelists `www.notion.so`, `images.unsplash.com`, `firebasestorage.googleapis.com`, and `raw.githubusercontent.com` as remote image hosts.

Blog titles use an in-title tag convention `"Post title [tag1, tag2]"`. `extractTags` / `getTitleWithoutTags` in [lib/utils.ts](lib/utils.ts) parse them — don't hand-parse tags elsewhere.

`revalidate = 0` on [app/[locale]/blog/page.tsx](app/[locale]/blog/page.tsx) disables caching for the blog list; posts are always fetched fresh from Notion.

### CMS（Vercel Blob）

サイトの内容は `lib/data.ts` ではなく **Vercel Blob 上の JSON 5 本**にある。
本人はスマホの `/admin` から、Claude は管理 API から更新する。設計の経緯は
[docs/superpowers/specs/2026-09-13-portfolio-cms-design.md](docs/superpowers/specs/2026-09-13-portfolio-cms-design.md)。

- コレクション: `projects` / `experiences` / `skills` / `photos` / `about`。スキーマは
  [lib/cms/schema.ts](lib/cms/schema.ts) の zod が唯一の定義で、API・管理画面・サイトが同じものを使う。
- **多言語テキストは `{ en, ja, zh }` の 1 型**（`L<string>`）。`pick(value, locale)` で引く。
  `title_ja` のような旧い持ち方はもう無い。
- 読み出しは [lib/cms/store.ts](lib/cms/store.ts) の `readCollection`（`unstable_cache` + タグ
  `cms:<name>`）。Blob の `get()` を `useCache: false` で呼ぶのが要点で、**CDN を必ず外す**
  （公開 URL は最低 60 秒キャッシュされるため、素直に読むと保存直後に古い内容が出る）。
- 書き込みは `writeCollection` だけ。`If-Match`（ETag）で競合を弾き、履歴を
  `content/_history/` へ退避し、`revalidateTag(tag, { expire: 0 })` で即時公開する。
  `updateTag` は Server Action 専用なので Route Handler からは使えない。
- **リポジトリの `content/*.json` はスナップショット**。Blob 障害時の表示保険、
  `BLOB_READ_WRITE_TOKEN` 未設定時の既定値、Claude が git 上で内容を読むための写しを兼ねる。
  真実の出所は Blob 側なので、内容を大きく変えたら `pnpm cms pull` で書き戻す。
- アイコンは名前文字列で持ち、[config/icon-registry.ts](config/icon-registry.ts) の許可リストで
  解決する。未知の名前は既定アイコンに落ちるのでサイトは壊れない。新しいアイコンを使うには
  ここへ import を 1 行足す。
- 画像はブラウザから Blob へ直接上げ（Vercel の関数は本文 4.5MB 上限）、
  `POST /api/admin/media` が sharp で webp・サムネ・ぼかしを作る。

#### Claude がコンテンツを更新する手順

```bash
pnpm cms get projects > /tmp/projects.json   # { etag, data } が返る
# /tmp/projects.json の data を編集する
pnpm cms put projects /tmp/projects.json     # etag 付きで保存（競合すれば中断する）
```

`CMS_BASE_URL` で接続先を変える（既定 `http://localhost:3000`）。本番を触るときは
`CMS_BASE_URL=https://<本番ドメイン>` を付ける。**保存＝即公開**なので、本番へ送る前に
内容を読み返すこと。

### Server vs client boundaries

- [lib/utils-server.ts](lib/utils-server.ts) is server-only (uses `next/headers`). It parses the UA for `isMobileDevice`. Do not import this from client components.
- Section-scroll state lives in [context/action-section-context.tsx](context/action-section-context.tsx); theme state in [context/theme-context.tsx](context/theme-context.tsx) (also uses `next-themes` elsewhere). Both providers wrap the tree in the locale layout.
- The home page ([app/[locale]/page.tsx](app/[locale]/page.tsx)) is a Server Component that reads every collection from the CMS and passes them down as props. Client components never import content directly — they receive it. 写真はリクエストごとにサーバ側で選び直す。

### Other conventions

- Path alias `@/*` maps to the repo root (see [tsconfig.json](tsconfig.json)).
- Tailwind v4 is configured via `@tailwindcss/postcss` in [postcss.config.js](postcss.config.js) and `app/globals.css` — there is **no `tailwind.config.ts`** despite what `components.json` implies.
- PWA is wired through `next-pwa` in [next.config.js](next.config.js); the service worker is only emitted on `next build`. The manifest is referenced from `metadata.manifest` in the locale layout.
- `react-icon-cloud`, `gsap`, `motion`, and `react-grid-layout` are all in use — prefer extending existing animation/layout patterns rather than adding another library.
