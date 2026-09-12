# CMS の準備手順

サイトの内容（写真・プロジェクト・経歴・スキル・文言）を、スマホの管理画面と
Claude の両方から更新できるようにするための設定。一度やれば済む。

保存先は **Vercel Blob** 1 つだけ。データベースは使わない。

---

## 1. Vercel Blob ストアを作る

1. Vercel のダッシュボード → 対象プロジェクト → **Storage** → **Create Database** → **Blob**
2. 作成したストアをこのプロジェクトに **Connect**
3. これで環境変数 `BLOB_READ_WRITE_TOKEN` が自動で入る（自分で設定しなくていい）

## 2. 環境変数を 3 つ足す

Vercel のプロジェクト設定 → Environment Variables に追加する。

| 変数 | 中身 | 作り方 |
|---|---|---|
| `CMS_SESSION_SECRET` | ログインの署名鍵。32 文字以上 | `openssl rand -hex 32` |
| `CMS_ADMIN_PASSWORD_HASH` | 管理画面のパスワード（ハッシュ） | `pnpm cms hash-password 'すきなパスワード'` |
| `CMS_SERVICE_TOKEN` | Claude が API を叩くための鍵 | `openssl rand -hex 24` |

> `CMS_ADMIN_PASSWORD_HASH` の区切りは `:` で、`$` は使わない。
> env ファイルのローダが `$xxx` を変数参照として展開してしまい、
> 「正しいパスワードなのに 401」になるため。

同じ 3 つを、ローカル開発用に `.env.local` にも書く（git 管理外）。

```
CMS_SESSION_SECRET=...
CMS_ADMIN_PASSWORD_HASH=scrypt:...:...
CMS_SERVICE_TOKEN=...
```

## 3. デプロイして初期内容を送る

デプロイ後、リポジトリに入っている `content/*.json` を Blob へ 1 回だけ送る。

```bash
CMS_BASE_URL=https://<本番のドメイン> pnpm cms push
```

送ったあとに `https://<本番のドメイン>/admin` を開き、設定したパスワードでログインする。

## 4. 使う

- **あなた**: `/admin` から編集する。保存するとすぐ公開される。
- **Claude**: `pnpm cms get <collection>` → 編集 → `pnpm cms put <collection> <file>`。

---

## ローカル開発

`BLOB_READ_WRITE_TOKEN` が無いときは、リポジトリの `content/*.json` をそのまま表示する。
サイトは完全に動くが、管理画面からの保存はできない（保存先が無いため）。

ローカルでも保存まで試したいときは、Vercel のストア画面に出ている
`BLOB_READ_WRITE_TOKEN` を `.env.local` に入れる。**本番と同じストアを触ることになる**
点に注意する。

## 内容を git に戻す

Blob 側が正となるが、リポジトリの `content/*.json` は保険と初期値を兼ねている。
大きく更新したら書き戻してコミットしておく。

```bash
CMS_BASE_URL=https://<本番のドメイン> pnpm cms pull
git add content && git commit -m "chore: CMS の内容をリポジトリへ反映"
```

## 巻き戻し

保存のたびに直前の版が `content/_history/<コレクション>/<日時>.json` に残る（直近 20 版）。
Vercel の Blob 画面からその JSON を開き、中身を `pnpm cms put` で送れば戻せる。

## トラブル

| 症状 | 原因と対処 |
|---|---|
| ログインで「パスワードが違います」 | `CMS_ADMIN_PASSWORD_HASH` の形式。`$` が混ざっていないか確認する |
| 「保存先（Vercel Blob）が未設定です」 | ストアを Connect していない。手順 1 |
| 保存時に「別の場所で更新されています」 | Claude か別端末が先に保存した。「読み直す」を押してから編集し直す |
| 画像のアップロードが失敗する | 25MB を超えていないか。HEIC のまま上がると変換に失敗することがある（JPEG で保存し直す） |
| 保存したのにサイトが変わらない | 数秒待ってから再読込。それでも変わらなければ Vercel の Functions ログを見る |
