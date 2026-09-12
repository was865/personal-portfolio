import { NextResponse } from "next/server"

import { requireAuth, type AuthSource } from "./auth"

export type ApiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "invalid_request"
  | "not_found"
  | "conflict"
  | "not_configured"
  | "server_error"

export function jsonError(
  status: number,
  error: ApiErrorCode,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json({ error, ...extra }, { status })
}

/**
 * 管理 API の共通前処理。認証していなければ 401 の Response を返す。
 *
 * Cookie で通った書き込みだけ Origin を確認する（SameSite=Lax の上乗せ）。
 * サービストークンは Cookie に依存しないので CSRF の対象外。
 */
export async function authorize(
  request: Request,
): Promise<{ source: AuthSource } | { response: NextResponse }> {
  const source = await requireAuth(request)
  if (!source) return { response: jsonError(401, "unauthorized") }

  const isWrite = request.method !== "GET" && request.method !== "HEAD"
  if (source === "cookie" && isWrite) {
    const origin = request.headers.get("origin")
    if (origin && new URL(origin).host !== request.headers.get("host")) {
      return { response: jsonError(403, "forbidden") }
    }
  }

  return { source }
}
