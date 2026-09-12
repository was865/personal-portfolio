import { randomUUID } from "node:crypto"

import { del, put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authorize, jsonError } from "@/lib/cms/api"
import { isBlobConfigured } from "@/lib/cms/blob"
import { processImage, type ImageKind } from "@/lib/cms/media"

export const runtime = "nodejs"
// 大きい写真の変換に数秒かかる。既定の上限だと足りないことがある。
export const maxDuration = 60

const bodySchema = z.object({
  /** クライアントが Blob へ直接上げた一時ファイルの URL。 */
  url: z.url(),
  kind: z.enum(["photo", "shot"]),
})

/** 1 年キャッシュ。内容が変わるときは別 id になるので長くて構わない。 */
const MEDIA_CACHE_SECONDS = 60 * 60 * 24 * 365

/**
 * アップロード済みの一時ファイルを webp に変換して本置き場へ移す。
 *
 * 返す `ImageRef` をそのままコレクションへ入れれば表示できる。
 * 元の一時ファイルは消すので、Blob に原本は残らない。
 */
export async function POST(request: Request) {
  const auth = await authorize(request)
  if ("response" in auth) return auth.response

  if (!isBlobConfigured()) return jsonError(503, "not_configured")

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return jsonError(400, "invalid_request", { issues: parsed.error.issues })
  }

  const { url, kind } = parsed.data

  try {
    const source = await fetch(url)
    if (!source.ok) return jsonError(400, "invalid_request", { detail: "一時ファイルを取得できない" })

    const processed = await processImage(Buffer.from(await source.arrayBuffer()), kind as ImageKind)

    const id = randomUUID()
    const dir = kind === "photo" ? "media/photos" : "media/shots"
    const common = {
      access: "public" as const,
      contentType: "image/webp",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: MEDIA_CACHE_SECONDS,
    }

    const [full, thumb] = await Promise.all([
      put(`${dir}/${id}/full.webp`, processed.full, common),
      put(`${dir}/${id}/thumb.webp`, processed.thumb, common),
    ])

    // 原本は残さない。置いておくと Blob の容量だけ食う。
    await del(url).catch((error) => console.warn("[cms] 一時ファイルを消せなかった", error))

    return NextResponse.json({
      image: {
        url: full.url,
        thumbUrl: thumb.url,
        width: processed.width,
        height: processed.height,
        blurDataURL: processed.blurDataURL,
      },
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : undefined
    console.error("[cms] 画像の変換に失敗した", error)
    return jsonError(400, "invalid_request", { detail })
  }
}
