import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

/** セッション Cookie 名。`__Host-` 前置は本番（HTTPS）でのみ付ける。 */
export const SESSION_COOKIE = "cms_session"

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const SCRYPT_KEY_LENGTH = 64

function sessionSecret(): Uint8Array {
  const value = process.env.CMS_SESSION_SECRET
  if (!value || value.length < 32) {
    throw new Error("CMS_SESSION_SECRET を 32 文字以上で設定する")
  }
  return new TextEncoder().encode(value)
}

/** 長さが違っても例外を投げずに false を返す定数時間比較。 */
export function compareToken(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8")
  const right = Buffer.from(b, "utf8")
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/**
 * `scrypt:<salt>:<hash>` 形式の文字列を作る。環境変数に置いて使う。
 *
 * 区切りが `$` でないのは意図的。env ファイルのローダが `$xxx` を変数参照として
 * 展開してしまい、ハッシュが空になって「正しいパスワードで 401」になる。
 */
export function hashPassword(password: string, salt = randomBytes(16).toString("hex")): string {
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex")
  return `scrypt:${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(":")
  if (scheme !== "scrypt" || !salt || !hash) return false

  return compareToken(scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex"), hash)
}

export function isPasswordConfigured(): boolean {
  return Boolean(process.env.CMS_ADMIN_PASSWORD_HASH)
}

export function verifyAdminPassword(password: string): boolean {
  const stored = process.env.CMS_ADMIN_PASSWORD_HASH
  if (!stored) return false
  return verifyPassword(password, stored)
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(sessionSecret())
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, sessionSecret())
    return true
  } catch {
    return false
  }
}

export async function startSession(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function endSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

/** 誰として通したか。ログや UI の出し分けに使う。 */
export type AuthSource = "cookie" | "service"

/**
 * 管理操作の唯一の入口。
 *
 * 人（管理画面）は Cookie、Claude は `X-Service-Token` ヘッダ。どちらも通らなければ null。
 * 呼び出し側は null を 401 に変換するだけでよい。
 */
export async function requireAuth(request?: Request): Promise<AuthSource | null> {
  const presented = request?.headers.get("x-service-token")
  const expected = process.env.CMS_SERVICE_TOKEN
  if (presented && expected && compareToken(presented, expected)) return "service"

  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (token && (await verifySessionToken(token))) return "cookie"

  return null
}
