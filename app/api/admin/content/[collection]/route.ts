import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { authorize, jsonError } from "@/lib/cms/api"
import { BlobNotConfiguredError } from "@/lib/cms/blob"
import { isCollectionName } from "@/lib/cms/schema"
import { ConflictError, readCollectionFresh, writeCollection } from "@/lib/cms/store"

export const runtime = "nodejs"
// 編集用の読み出しはキャッシュしない。常に現在の etag が要る。
export const dynamic = "force-dynamic"

type Context = { params: Promise<{ collection: string }> }

/**
 * `{ etag, data }` を返す。`etag` は編集開始時点の版で、保存時に `If-Match` へ入れる。
 * `null` は「まだ Blob 上に無い（スナップショットを見ている）」を意味する。
 */
export async function GET(request: Request, { params }: Context) {
  const auth = await authorize(request)
  if ("response" in auth) return auth.response

  const { collection } = await params
  if (!isCollectionName(collection)) return jsonError(404, "not_found")

  const { etag, data } = await readCollectionFresh(collection)
  return NextResponse.json({ etag, data })
}

/**
 * コレクションを丸ごと差し替える。
 *
 * `If-Match` ヘッダが現在の版と一致しなければ 409 を返し、現在の etag を添える。
 * ヘッダ無しは「まだ Blob 上に無いはず」の意味になる。
 */
export async function PUT(request: Request, { params }: Context) {
  const auth = await authorize(request)
  if ("response" in auth) return auth.response

  const { collection } = await params
  if (!isCollectionName(collection)) return jsonError(404, "not_found")

  const body = await request.json().catch(() => null)
  if (body === null) return jsonError(400, "invalid_request", { detail: "JSON として読めない" })

  const ifMatch = request.headers.get("if-match")

  try {
    const { etag, data } = await writeCollection(collection, body, ifMatch)
    return NextResponse.json({ etag, data })
  } catch (error) {
    if (error instanceof ConflictError) {
      return jsonError(409, "conflict", { currentEtag: error.currentEtag })
    }
    if (error instanceof ZodError) {
      return jsonError(400, "invalid_request", { issues: error.issues.slice(0, 20) })
    }
    if (error instanceof BlobNotConfiguredError) {
      return jsonError(503, "not_configured", { detail: error.message })
    }
    console.error(`[cms] ${collection} の保存に失敗した`, error)
    return jsonError(500, "server_error")
  }
}
