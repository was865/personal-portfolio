# 個人サイト CMS 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans（本セッションで実行）。ステップは `- [ ]` で追跡する。

**Goal:** サイトの内容（写真・プロジェクト事例・経歴・スキル・文言）を、本人はスマホの管理画面から、Claude は管理 API から更新できるようにする。

**Architecture:** コンテンツは Vercel Blob 上の JSON ドキュメント 5 本。読み出しは `head()` で ETag を取り `?v=<etag>` 付きで本体を取得し `unstable_cache` にタグ付きで載せる。書き込みは `/api/admin/*` の 1 経路に集約し、`If-Match` と Blob の `ifMatch` で競合を弾き、成功で `revalidateTag`。リポジトリ内のスナップショットが Blob 障害時とローカル開発の既定値になる。

**Tech Stack:** Next.js 16 (App Router) / React 19 / Tailwind v4 / next-intl / @vercel/blob / zod / sharp / jose / vitest

**Spec:** `docs/superpowers/specs/2026-09-13-portfolio-cms-design.md`

## Global Constraints

- Next.js 16。API を書く前に `node_modules/next/dist/docs/` の該当ガイドを読む。`middleware.ts` は `proxy.ts` に改名済み。
- `cacheComponents` は有効化しない。キャッシュは `unstable_cache` + `revalidateTag`。
- 多言語テキストは `{ en, ja, zh }` の 1 型に統一する。
- コミットメッセージは Conventional Commits + 日本語説明。既存履歴に合わせる。
- サイトは `BLOB_READ_WRITE_TOKEN` 未設定でも完全に動くこと（スナップショットで描画）。
- `pnpm build` は `--webpack`（next-pwa のため）。E2E 前の必須ゲート。
- 改行は LF。

---

### Task 1: 依存と vitest 基盤

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `lib/cms/deep-merge.ts`
- Test: `lib/cms/deep-merge.test.ts`

**Interfaces:**
- Produces: `deepMerge<T>(base: T, override: unknown): T`

- [x] **Step 1: 依存を入れる**

```bash
pnpm add @vercel/blob zod sharp jose
pnpm add -D vitest
```

- [x] **Step 2: vitest 設定と scripts**

`vitest.config.ts` は `@` エイリアスを repo root に解決し、`environment: 'node'`、`include: ['lib/**/*.test.ts', 'config/**/*.test.ts']`。
`package.json` に `"test": "vitest run"` を追加。

- [x] **Step 3: 失敗するテストを書く**

```ts
// lib/cms/deep-merge.test.ts
import { expect, it } from "vitest"
import { deepMerge } from "./deep-merge"

it("上書きは葉だけ差し替え、隣の値は残す", () => {
  const base = { AboutSection: { desc: "a", para1: "b" } }
  expect(deepMerge(base, { AboutSection: { desc: "z" } }))
    .toEqual({ AboutSection: { desc: "z", para1: "b" } })
})

it("空文字の上書きは無視する（CMS の未入力で本文が消えない）", () => {
  const base = { A: { x: "keep" } }
  expect(deepMerge(base, { A: { x: "" } })).toEqual({ A: { x: "keep" } })
})

it("base を破壊しない", () => {
  const base = { A: { x: "1" } }
  deepMerge(base, { A: { x: "2" } })
  expect(base.A.x).toBe("1")
})
```

- [x] **Step 4: 失敗を確認** — `pnpm test lib/cms/deep-merge.test.ts`
- [x] **Step 5: 実装して緑にする**
- [x] **Step 6: コミット** — `chore: CMS 用の依存と vitest を追加`

---

### Task 2: コンテンツスキーマ

**Files:**
- Create: `lib/cms/schema.ts`
- Test: `lib/cms/schema.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = "en" | "ja" | "zh"`、`type L<T = string> = Record<Locale, T>`
  - `ImageRef = { url: string; width: number; height: number; thumbUrl?: string }`
  - `collectionSchemas: Record<CollectionName, ZodType>`、`type CollectionName = "projects" | "experiences" | "skills" | "photos" | "about"`
  - `pick<T>(value: L<T>, locale: string): T`

- [x] **Step 1: 失敗するテストを書く**

```ts
import { expect, it } from "vitest"
import { collectionSchemas, pick } from "./schema"

it("slug が空のプロジェクトを弾く", () => {
  const r = collectionSchemas.projects.safeParse({ items: [{ slug: "" }] })
  expect(r.success).toBe(false)
})

it("locale が欠けた多言語テキストを弾く", () => {
  const r = collectionSchemas.experiences.safeParse({
    items: [{ id: "a", order: 0, title: { en: "x", ja: "x" }, location: {}, description: {}, icon: "FaCode", date: {} }],
  })
  expect(r.success).toBe(false)
})

it("pick は未知の locale で en に落ちる", () => {
  expect(pick({ en: "e", ja: "j", zh: "z" }, "fr")).toBe("e")
})
```

- [x] **Step 2: 失敗を確認**
- [x] **Step 3: スキーマを実装**（`items` 配列でラップし、将来のメタ追加に備える）
- [x] **Step 4: 緑を確認**
- [x] **Step 5: コミット** — `feat: CMS コンテンツの zod スキーマを追加`

---

### Task 3: 既存コンテンツをスナップショットへ移行

**Files:**
- Create: `content/projects.json` `content/experiences.json` `content/skills.json` `content/photos.json` `content/about.json`
- Create: `lib/cms/snapshot.ts`
- Create: `scripts/measure-images.mjs`
- Test: `lib/cms/snapshot.test.ts`

**Interfaces:**
- Produces: `readSnapshot(name: CollectionName): unknown`

- [x] **Step 1: `lib/data.ts` の内容を JSON へ変換**

`experiencesData` / `experiencesDataZn` / `experiencesDataJa` を 1 本へ畳み、`title` `location` `description` `date` を `L` にする。プロジェクトは `title`/`title_ja`/`title_zh` を `title: L`、`description`/`desc_ja`/`desc_zh` を `description: L`、`caseStudy` はそのまま `L`。アイコンは `React.createElement(FaCode)` を `"FaCode"` に。

- [x] **Step 2: 画像の幅高さを埋める**

```bash
node scripts/measure-images.mjs
```

`content/*.json` の `image.url` が `/images/...` のものを `public` から読み、`width` `height` を書き戻す。

- [x] **Step 3: スナップショットがスキーマを通ることをテスト**

```ts
import { expect, it } from "vitest"
import { collectionSchemas } from "./schema"
import { readSnapshot } from "./snapshot"

it.each(["projects", "experiences", "skills", "photos", "about"] as const)(
  "%s のスナップショットはスキーマを通る",
  (name) => {
    expect(collectionSchemas[name].safeParse(readSnapshot(name)).success).toBe(true)
  },
)
```

- [x] **Step 4: 緑を確認**
- [x] **Step 5: コミット** — `feat: 既存コンテンツを content/*.json へ移行`

---

### Task 4: Blob ストア

**Files:**
- Create: `lib/cms/blob.ts`
- Create: `lib/cms/store.ts`
- Test: `lib/cms/store.test.ts`

**Interfaces:**
- Produces:
  - `readCollection(name): Promise<Data>` — Blob、失敗時スナップショット
  - `readCollectionWithEtag(name): Promise<{ etag: string | null; data: unknown }>`
  - `writeCollection(name, data, ifMatch): Promise<{ etag: string }>` — 不一致は `ConflictError`
  - `contentTag(name): string`

- [x] **Step 1: 失敗するテストを書く**（`@vercel/blob` は `vi.mock` で差し替え）

```ts
it("Blob が落ちてもスナップショットで描画できる")
it("etag 不一致は ConflictError")
it("本体取得 URL に ?v=<etag> が付く（CDN を外す）")
```

- [x] **Step 2: 失敗を確認**
- [x] **Step 3: 実装**

`readCollection` は `unstable_cache(fn, [name], { tags: [contentTag(name)] })`。
`writeCollection` は `head` → 比較 → 履歴退避 → `put(..., { allowOverwrite: true, ifMatch, cacheControlMaxAge: 60, addRandomSuffix: false })` → `revalidateTag`。
トークン未設定時は読みはスナップショット、書きは `BlobNotConfiguredError`。

- [x] **Step 4: 緑を確認**
- [x] **Step 5: コミット** — `feat: Blob 上のコンテンツ読み書きを追加`

---

### Task 5: サイト側の配線

**Files:**
- Create: `config/icon-registry.ts`
- Modify: `app/[locale]/page.tsx` `app/[locale]/projects/[slug]/page.tsx` `i18n/request.ts`
- Modify: `components/{Projects,Project,ProjectCase,Experience,Skills,Intro,AboutArea}.tsx`
- Modify: `lib/data.ts`（`links` だけ残す）、`lib/utils-server.ts`
- Modify: `next.config.js`（`*.public.blob.vercel-storage.com` を remotePatterns へ）
- Test: `config/icon-registry.test.ts`

**Interfaces:**
- Consumes: Task 4 の `readCollection`
- Produces: `resolveIcon(name: string, className?: string): ReactElement`

- [x] **Step 1: アイコン解決のテスト**

```ts
it("未知のアイコン名でも落ちず既定を返す", () => {
  expect(resolveIcon("NoSuchIcon")).toBeTruthy()
})
```

- [x] **Step 2: 実装（許可リスト）**
- [x] **Step 3: サーバコンポーネントで読み、props で渡す**

クライアントコンポーネントは `@/lib/data` を import せず props で受ける。React 要素は props で渡さず、アイコン名を渡してクライアント側で `resolveIcon` する。

- [x] **Step 4: messages のマージ**

`i18n/request.ts` で `deepMerge(messages, about.messages[locale])`。

- [x] **Step 5: `pnpm exec tsc --noEmit` と `pnpm build` を通す**
- [x] **Step 6: dev サーバで 3 ロケール + プロジェクト詳細を目視**
- [x] **Step 7: コミット** — `refactor: サイト表示を CMS コンテンツ経由に切り替え`

---

### Task 6: 認証・管理 API・CLI

**Files:**
- Create: `lib/cms/auth.ts`
- Create: `app/api/admin/session/route.ts`
- Create: `app/api/admin/content/[collection]/route.ts`
- Create: `scripts/cms.mjs`
- Test: `lib/cms/auth.test.ts`

**Interfaces:**
- Produces:
  - `hashPassword(pw)` / `verifyPassword(pw, stored)`（scrypt）
  - `createSessionToken()` / `verifySessionToken(token)`（jose）
  - `requireAuth(req): Promise<"cookie" | "service" | null>`
  - `compareToken(a, b): boolean`（長さ差でも例外を投げない）

- [x] **Step 1: 失敗するテストを書く**

```ts
it("長さの違うトークンでも例外を投げず false", () => {
  expect(compareToken("short", "muchlongertoken")).toBe(false)
})
it("scrypt のハッシュを検証できる", () => {
  const h = hashPassword("pw")
  expect(verifyPassword("pw", h)).toBe(true)
  expect(verifyPassword("px", h)).toBe(false)
})
```

- [x] **Step 2: 失敗を確認 → 実装 → 緑を確認**
- [x] **Step 3: API ルートを実装**（`runtime = "nodejs"`、zod 検証、409、`revalidateTag`）
- [x] **Step 4: CLI を実装**

```bash
pnpm cms get projects
pnpm cms put projects file.json
pnpm cms hash-password
```

- [x] **Step 5: コミット** — `feat: CMS の認証と管理 API を追加`

---

### Task 7: 管理画面

**Files:**
- Create: `app/admin/layout.tsx` `app/admin/page.tsx` `app/admin/login/page.tsx`
- Create: `app/admin/photos/page.tsx` `app/admin/projects/page.tsx` `app/admin/projects/[slug]/page.tsx` `app/admin/experiences/page.tsx` `app/admin/skills/page.tsx` `app/admin/about/page.tsx`
- Create: `components/admin/*`

- [x] **Step 1: レイアウトで認証、未認証は `/admin/login` へ**
- [x] **Step 2: 各画面は `{etag,data}` を取り、保存時に `PUT`。409 は再読込を促す**
- [x] **Step 3: スマホ幅（375px）で操作できることを確認**
- [x] **Step 4: コミット** — `feat: CMS の管理画面を追加`

---

### Task 8: 画像パイプライン

**Files:**
- Create: `lib/cms/media.ts`
- Create: `app/api/admin/upload/route.ts`
- Create: `app/api/admin/media/route.ts`
- Test: `lib/cms/media.test.ts`

**Interfaces:**
- Produces: `processImage(buf, kind): Promise<{ full, thumb, width, height }>`

- [x] **Step 1: 失敗するテストを書く**（3000x2000 が長辺 2000 に収まり webp になること）
- [x] **Step 2: 実装 → 緑を確認**
- [x] **Step 3: ルートを実装**（`maxDuration = 60`）
- [x] **Step 4: コミット** — `feat: 画像アップロードと webp 変換を追加`

---

### Task 9: ドキュメントと最終ゲート

**Files:**
- Modify: `CLAUDE.md`
- Create: `docs/cms-setup.md`

- [x] **Step 1: `pnpm lint`**
- [x] **Step 2: `pnpm exec tsc --noEmit`**
- [x] **Step 3: `pnpm test`**
- [x] **Step 4: `pnpm build`**
- [x] **Step 5: ドキュメントを書いてコミット、ブランチを push**

---

## 実装後のメモ（計画との差分）

実装して分かったことと、計画から変えた点。

- **読み出しは `head()` + `?v=<etag>` ではなく `get(path, { useCache: false })`。**
  @vercel/blob 2.8 の `get()` に CDN を外して origin から読む指定があり、
  1 回の呼び出しで本文と ETag の両方が取れる。2 段構えは不要だった。
- **`revalidateTag(tag)` の 1 引数形は Next 16 で型エラー**（非推奨）。
  `"max"` は stale-while-revalidate で「保存したのにまだ古い」が一度出るため、
  即時公開には `revalidateTag(tag, { expire: 0 })` を使う。`updateTag` は Server Action 専用。
- **パスワードハッシュの区切りは `$` ではなく `:`。**
  `scrypt$salt$hash` は env ローダが `$salt` を変数参照として展開し、
  「正しいパスワードで 401」になる。実際に踏んだ。
- 環境変数名は `ADMIN_PASSWORD_HASH` ではなく `CMS_` 接頭辞で統一した。
- `scripts/measure-images.mjs` は独立させず `scripts/migrate-content.mjs` に含めた。
  画像の寸法とぼかしは移行と同時にしか要らない。
- 画像の `blurDataURL` をスキーマに足した。既存の `placeholder="blur"` を維持するため。
- vite を devDependency に足した。移行スクリプトが `lib/data.ts`（react-icons の React 要素と
  Next の静的画像 import を含む）を読むために SSR ローダが要る。
- **未検証**: 実 Blob ストアに対する書き込み経路（保存・履歴・画像アップロード）は
  トークンが無いため単体テスト（モック）止まり。`docs/cms-setup.md` の手順で
  ストアを繋いだあと、一度 `/admin` から保存して確かめること。
