#!/usr/bin/env node
/**
 * CMS の管理 API を叩く小さな CLI。人は管理画面、Claude はこれを使う。
 *
 *   pnpm cms get projects > /tmp/p.json     # { etag, data } を取得
 *   pnpm cms put projects /tmp/p.json       # 取得時の etag で条件付き保存
 *   pnpm cms pull                           # Blob → リポジトリの content/*.json
 *   pnpm cms push                           # リポジトリの content/*.json → Blob
 *   pnpm cms hash-password 'my password'    # CMS_ADMIN_PASSWORD_HASH の値を作る
 *
 * 接続先は CMS_BASE_URL（既定 http://localhost:3000）、認証は CMS_SERVICE_TOKEN。
 * どちらも .env.local から読む。
 */
import { randomBytes, scryptSync } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const COLLECTIONS = ["projects", "experiences", "skills", "photos", "about"]

/** .env.local → .env の順に読む。既に環境にある値は上書きしない。 */
async function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    let text
    try {
      text = await fs.readFile(path.join(root, file), "utf8")
    } catch {
      continue
    }
    for (const line of text.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
      if (!match) continue
      const [, key, rawValue] = match
      if (process.env[key] !== undefined) continue
      process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "")
    }
  }
}

function baseUrl() {
  return (process.env.CMS_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

function serviceToken() {
  const token = process.env.CMS_SERVICE_TOKEN
  if (!token) die("CMS_SERVICE_TOKEN が未設定。.env.local に入れる")
  return token
}

function die(message) {
  console.error(`エラー: ${message}`)
  process.exit(1)
}

function assertCollection(name) {
  if (!COLLECTIONS.includes(name)) die(`コレクション名は ${COLLECTIONS.join(" / ")} のいずれか`)
  return name
}

async function apiGet(collection) {
  const response = await fetch(`${baseUrl()}/api/admin/content/${collection}`, {
    headers: { "X-Service-Token": serviceToken() },
  })
  if (!response.ok) die(`GET ${collection} が ${response.status}: ${await response.text()}`)
  return response.json()
}

async function apiPut(collection, data, etag) {
  const response = await fetch(`${baseUrl()}/api/admin/content/${collection}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Token": serviceToken(),
      ...(etag ? { "If-Match": etag } : {}),
    },
    body: JSON.stringify(data),
  })

  if (response.status === 409) {
    const body = await response.json()
    die(`${collection} は他で更新されている（現在 ${body.currentEtag}）。get し直してから put する`)
  }
  if (!response.ok) die(`PUT ${collection} が ${response.status}: ${await response.text()}`)

  return response.json()
}

async function commandGet(collection) {
  process.stdout.write(`${JSON.stringify(await apiGet(assertCollection(collection)), null, 2)}\n`)
}

async function commandPut(collection, file) {
  assertCollection(collection)
  if (!file) die("保存するファイルを指定する")

  const parsed = JSON.parse(await fs.readFile(path.resolve(file), "utf8"))
  // `cms get` の出力（{ etag, data }）をそのまま編集して渡せるようにする。
  // 素のコレクションを渡された場合は現在の etag を取り直す（上書き確定）。
  const hasEnvelope = parsed && typeof parsed === "object" && "data" in parsed
  const data = hasEnvelope ? parsed.data : parsed
  const etag = hasEnvelope ? parsed.etag : (await apiGet(collection)).etag

  const result = await apiPut(collection, data, etag)
  console.log(`${collection} を保存した（etag ${result.etag}）`)
}

async function commandPull(names) {
  for (const collection of names) {
    const { data } = await apiGet(collection)
    const file = path.join(root, "content", `${collection}.json`)
    await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8")
    console.log(`${path.relative(root, file)} を更新した`)
  }
}

async function commandPush(names) {
  for (const collection of names) {
    const data = JSON.parse(
      await fs.readFile(path.join(root, "content", `${collection}.json`), "utf8"),
    )
    const { etag } = await apiGet(collection)
    const result = await apiPut(collection, data, etag)
    console.log(`${collection} を送った（etag ${result.etag}）`)
  }
}

/** lib/cms/auth.ts の hashPassword と同じ形式（scrypt:salt:hash）を作る。 */
function commandHashPassword(password) {
  if (!password) die("パスワードを引数で渡す: pnpm cms hash-password 'my password'")
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  console.log(`CMS_ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`)
}

async function main() {
  await loadEnv()
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case "get":
      return commandGet(args[0])
    case "put":
      return commandPut(args[0], args[1])
    case "pull":
      return commandPull(args.length > 0 ? args.map(assertCollection) : COLLECTIONS)
    case "push":
      return commandPush(args.length > 0 ? args.map(assertCollection) : COLLECTIONS)
    case "hash-password":
      return commandHashPassword(args[0])
    default:
      console.log(
        [
          "使い方:",
          "  pnpm cms get <collection>",
          "  pnpm cms put <collection> <file.json>",
          "  pnpm cms pull [collection...]",
          "  pnpm cms push [collection...]",
          "  pnpm cms hash-password '<password>'",
          "",
          `コレクション: ${COLLECTIONS.join(" / ")}`,
          `接続先: ${baseUrl()}`,
        ].join("\n"),
      )
      if (command) process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
