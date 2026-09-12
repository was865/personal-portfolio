import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

import { authorize, jsonError } from "@/lib/cms/api"

export const runtime = "nodejs"

/** 受け付ける画像。HEIC はブラウザ側で JPEG に変換されることが多いが、来ても一応通す。 */
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
]

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

/**
 * ブラウザから Blob へ直接アップロードするためのトークンを発行する。
 *
 * サーバ経由にしない理由は Vercel の関数がリクエスト本文 4.5MB までで、
 * iPhone の写真が普通にそれを超えるため。ここで発行するトークンは 1 分で切れる。
 * 変換とコレクションへの登録は POST /api/admin/media が引き受ける。
 */
export async function POST(request: Request) {
  const auth = await authorize(request)
  if ("response" in auth) return auth.response

  const body = (await request.json().catch(() => null)) as HandleUploadBody | null
  if (!body) return jsonError(400, "invalid_request")

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
        validUntil: Date.now() + 60_000,
      }),
      // 完了通知は使わない。変換は管理画面が /api/admin/media を呼んで行う
      // （ローカル開発では Vercel からのコールバックが届かないため）。
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[cms] アップロード用トークンの発行に失敗した", error)
    return jsonError(400, "invalid_request", {
      detail: error instanceof Error ? error.message : undefined,
    })
  }
}
