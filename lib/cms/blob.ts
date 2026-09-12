import { del, get, list, put } from "@vercel/blob"

import type { CollectionName } from "./schema"

/** Blob ストアが繋がっていない（トークン未設定）。読みはスナップショットで凌げるが書きは不可。 */
export class BlobNotConfiguredError extends Error {
  constructor() {
    super("BLOB_READ_WRITE_TOKEN が設定されていないため、コンテンツを保存できない")
    this.name = "BlobNotConfiguredError"
  }
}

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export function contentPath(name: CollectionName): string {
  return `content/${name}.json`
}

export function historyPrefix(name: CollectionName): string {
  return `content/_history/${name}/`
}

export type ContentBlob = {
  etag: string
  text: string
}

/**
 * コンテンツ本体を読む。
 *
 * `useCache: false` が要点。Blob の公開 URL は CDN が最低 60 秒キャッシュするので、
 * 素直に URL を fetch すると保存直後に古い内容が返る。origin から直接読ませて即時反映を担保する。
 */
export async function readContentBlob(name: CollectionName): Promise<ContentBlob | null> {
  const result = await get(contentPath(name), { access: "public", useCache: false })
  if (!result || result.statusCode !== 200) return null

  return {
    etag: result.blob.etag,
    text: await new Response(result.stream).text(),
  }
}

/**
 * コンテンツ本体を書く。`ifMatch` を渡すと、その ETag のままのときだけ書き込まれる
 * （Blob 側の条件付き書き込み。すり抜けた競合はここで弾かれる）。
 */
export async function writeContentBlob(
  name: CollectionName,
  text: string,
  ifMatch?: string,
): Promise<string> {
  const result = await put(contentPath(name), text, {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    // CDN の最小値。読み出しは useCache: false で origin を見るので実害はないが、
    // 誰かが直接 URL を踏んだときの古さをこれ以上伸ばさない。
    cacheControlMaxAge: 60,
    ...(ifMatch ? { ifMatch } : {}),
  })

  return result.etag
}

/** 上書き前の版を履歴へ退避する。巻き戻しは履歴の中身をそのまま PUT し直すだけ。 */
export async function archiveContentBlob(name: CollectionName, text: string): Promise<void> {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")

  await put(`${historyPrefix(name)}${stamp}.json`, text, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

/** 履歴を直近 `keep` 件に切り詰める。失敗しても本体の保存は成功扱いにする。 */
export async function pruneHistory(name: CollectionName, keep = 20): Promise<void> {
  const { blobs } = await list({ prefix: historyPrefix(name) })
  const stale = blobs
    .slice()
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .slice(keep)

  if (stale.length > 0) await del(stale.map((blob) => blob.url))
}
