# 個人サイト CMS 設計

日付: 2026-09-13
対象リポジトリ: `personal-portfolio`（Next.js 16 / React 19 / Tailwind v4 / next-intl）

## 目的

サイトの内容（プロジェクト事例・経歴・スキル・写真・自己紹介文）を、
本人がスマホからでも、Claude が API 経由でも更新できるようにする。
コードを編集して再デプロイしないと文言ひとつ直せない現状をやめる。

## 前提（確定した制約）

| 項目 | 決定 |
|---|---|
| 管理画面の場所 | 公開 URL（ログインあり）。スマホから使う |
| 管理対象 | 写真 / プロジェクト事例 / 経歴・スキル / 自己紹介・UI 文言 |
| ブログ | 現状どおり Notion。本 CMS の対象外 |
| ホスティング | Vercel 無料枠（ファイルシステムへ書けない） |
| Claude の経路 | 管理 API + サービストークン |
| 公開タイミング | 保存＝即公開（下書き状態は持たない） |
| 保存先 | Vercel Blob のみ。DB なし |

## 全体構成

```
   あなた（スマホ/PC）── Cookie セッション ─┐
                                            ├→ /api/admin/*  ──┐
   Claude ── X-Service-Token ───────────────┘                   │
                                                                ↓
   サイト表示 ← lib/cms/store ← Vercel Blob ←── put(ifMatch) ────┘
                unstable_cache      content/*.json         + revalidateTag
                tag: content:<name> media/**
```

### Blob レイアウト

```
content/projects.json        コレクション本体
content/experiences.json
content/skills.json
content/photos.json
content/about.json
content/_history/<name>/<ISO8601>.json   直前の版（巻き戻し用、直近 20 版）
media/photos/<id>/full.webp              長辺 2000px
media/photos/<id>/thumb.webp             長辺 640px
media/projects/<slug>/<id>.webp
media/tmp/<uuid>.<ext>                   クライアント直アップロードの一時置き場
```

### 読み出し

`lib/cms/store.ts` の `readCollection(name)`:

1. `head('content/<name>.json')` で現在の ETag を得る（Blob API 直叩き。CDN を経由しない）
2. `fetch(url + '?v=' + etag, { cache: 'no-store' })` で本体を取る
3. zod で検証して返す

全体を `unstable_cache` で包み、タグ `content:<name>` を付ける。

ETag をクエリに付けるのが要点。Blob の公開 URL は CDN が最低 60 秒キャッシュする
（`cacheControlMaxAge` の下限が 60 秒）ため、URL をそのまま読むと保存直後に古い内容が出る。
ETag が変われば URL が変わるので、CDN を確実に外せる。

`cacheComponents`（`use cache`）は有効化しない。既存ページ全体の描画モデルが変わるため、
現行のキャッシュモデル（`unstable_cache` + `revalidateTag`）に留める。

### 書き込み

1. `requireAuth()` — Cookie セッション or サービストークン
2. zod で検証
3. `head()` で現在の ETag を取り、リクエストの `If-Match` と比較（不一致なら 409）
4. 旧版を `content/_history/<name>/<ISO>.json` へ退避
5. `put('content/<name>.json', body, { allowOverwrite: true, ifMatch, cacheControlMaxAge: 60 })`
6. `revalidateTag('content:<name>')`

`ifMatch` は Blob 側の条件付き書き込み。3 の比較をすり抜けた競合も put 段階で弾かれる。

### フォールバック

`content/*.json` の同じ内容をリポジトリにも置く（スナップショット）。

- Blob が読めないときの表示保険（サイトは落とさない）
- `BLOB_READ_WRITE_TOKEN` 未設定のローカル開発の既定値
- Claude が現在の内容を git 上で読むための写し

`pnpm cms pull` で Blob → リポジトリ、`pnpm cms push` でリポジトリ → Blob。
スナップショットは「保険と初期値」であって真実の出所ではない。真実は Blob。

## コンテンツモデル

### 横断ルール

- 多言語テキストは `L<string> = { en: string; ja: string; zh: string }` に統一する。
  現状は経歴が 3 本の並行配列（`experiencesData` / `experiencesDataZn` / `experiencesDataJa`）、
  プロジェクトが `title_zh` / `caseStudy.problem.zh` の二流儀で混在している。揃えないと
  管理画面のフォームが項目ごとに別物になる。
- 画像参照は `ImageRef = { url, width, height, thumbUrl? }`。幅高さを持たせ、
  `<Image>` のレイアウトシフトを今と同じく防ぐ。
- アイコンは名前文字列（`"FaCode"`）で保持し、`config/icon-registry.ts` の許可リストで
  React コンポーネントへ解決する。未知の名前は既定アイコンへフォールバックし、
  CMS の入力ミスでサイトが落ちないようにする。

### コレクション

| ファイル | 主なフィールド |
|---|---|
| `projects.json` | `slug` `order` `visible` `title: L` `description: L` `tags: string[]` `caseStudy: { problem, role, decisions, result }: L` `shots: [{ image: ImageRef, caption: L }]` |
| `experiences.json` | `id` `order` `title: L` `location: L` `description: L` `icon` `date: L` |
| `skills.json` | `groups: [{ key, ids }]` `items: [{ id, name, icon, desc: L }]` |
| `photos.json` | `items: [{ id, order, image: ImageRef, caption?: L }]` |
| `about.json` | `messages`: `messages/*.json` の部分木（`{ ja: { AboutSection: { desc: "..." } } }`） |

### 文言（next-intl）

`messages/{en,ja,zh}.json` はリポジトリに残し既定値とする。`i18n/request.ts` で
`about.json` の部分木を deep merge する。UI ラベルは git 管理のまま、
自己紹介文などは CMS が上書きする。マージは全キー対象。管理画面は自己紹介まわりを
整形して出し、それ以外はキー一覧から編集する。

## 管理画面

`app/admin/*`（`[locale]` の外。既存の i18n ルーティングと `proxy.ts` は触らない）

```
/admin/login
/admin                 ハブ
/admin/photos          アップロード・並び替え・削除
/admin/projects        一覧
/admin/projects/[slug] 事例編集（3 言語 + スクリーンショット）
/admin/experiences
/admin/skills
/admin/about           文言
```

スマホ前提で 1 カラム・大きいタップ領域。既存の Tailwind トークンとダークテーマを使う。
並び替えはドラッグではなく上下移動ボタン（指で確実に動く）。
編集画面は開いた時の ETag を保持し、409 なら「他で更新された」と伝えて再読込させる。

## 認証

- 本人: パスワード 1 つ。`ADMIN_PASSWORD_HASH`（scrypt、`node:crypto` のみ）と照合し、
  `jose` の JWT を httpOnly / Secure / SameSite=Lax の Cookie に 30 日。
- Claude: `CMS_SERVICE_TOKEN` を `X-Service-Token` ヘッダで送り `timingSafeEqual` で比較。
- 判定は `lib/cms/auth.ts` の `requireAuth()` に集約。`/admin` レイアウトと全 API が
  そこだけを呼ぶ。ログイン失敗は一律の文言 + 1 秒待ち。

## API

すべて JSON、zod 検証、`runtime = 'nodejs'`。

| メソッド | パス | 役割 |
|---|---|---|
| `POST` / `DELETE` | `/api/admin/session` | ログイン / ログアウト |
| `GET` | `/api/admin/content/[collection]` | `{ etag, data }` |
| `PUT` | `/api/admin/content/[collection]` | `If-Match` 必須。不一致 409。成功で新 etag と `revalidateTag` |
| `POST` | `/api/admin/upload` | クライアント直アップロード用トークン発行（`handleUpload`） |
| `POST` | `/api/admin/media` | 一時 Blob を webp 化し `ImageRef` を返す |

## 画像パイプライン

Vercel の関数はリクエスト本文 4.5MB が上限で、iPhone の写真は普通に超える。
そのためブラウザから Blob へ直接上げる。

```
ブラウザ ──(1) POST /api/admin/upload ──→ クライアントトークン
        ──(2) @vercel/blob/client upload ──→ media/tmp/<uuid>.jpg
        ──(3) POST /api/admin/media { url } ─→ サーバが取得し sharp で変換
                                              media/photos/<id>/full.webp (長辺 2000, q82)
                                              media/photos/<id>/thumb.webp (長辺 640, q75)
                                              一時 Blob を削除
                                              ← { url, thumbUrl, width, height }
        ──(4) PUT /api/admin/content/photos ─→ コレクションへ登録
```

HEIC は sharp が標準では復号できない。iOS Safari のアップロードは通常 JPEG へ変換されるが、
変換に失敗した場合は「JPEG/PNG/WebP で保存し直してください」と返す（対応は必要になってから）。

## 移行

1. `lib/data.ts` の内容を `content/*.json` へ変換（多言語は `L` へ正規化）
2. 既存画像は `public/images/**` のまま参照し、sharp で幅高さを埋める
   （Blob 未設定でもサイトが完全に動く状態を保つ）
3. コンポーネントをサーバ側で読んだデータの props 受け取りへ変更
4. `lib/data.ts` はナビゲーションの `links` だけ残す
5. Blob 設定後に `pnpm cms push` で Blob へ載せ、画像も `pnpm cms push-media` で移す

## テスト

現状テストなし。vitest を入れ、壊れると痛い純粋ロジックだけを対象にする。

- zod スキーマ（不正な入力を弾くこと・既存スナップショットが通ること）
- `deepMerge`（messages 上書き）
- アイコン解決（未知の名前で落ちない）
- ETag 比較と 409 判定
- サービストークン比較（長さ違いで例外を投げない）

E2E は既存の Playwright で `/admin` のログイン→保存だけ後日。

## やらないこと

- 下書き / 公開ワークフロー（保存＝即公開）
- 複数ユーザー・権限管理
- ブログの移行（Notion のまま）
- 画像の自動生成 alt、AI 補助
- CDN 画像変換（sharp で足りる）
