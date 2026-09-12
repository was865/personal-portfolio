import { revalidateTag, unstable_cache } from "next/cache"

import {
  archiveContentBlob,
  BlobNotConfiguredError,
  isBlobConfigured,
  pruneHistory,
  readContentBlob,
  writeContentBlob,
} from "./blob"
import {
  collectionSchemas,
  type CollectionData,
  type CollectionName,
} from "./schema"
import { readSnapshot } from "./snapshot"

/** 他の誰か（管理画面 / Claude）が先に更新していた。`currentEtag` を読み直してやり直す。 */
export class ConflictError extends Error {
  constructor(readonly currentEtag: string | null) {
    super("コンテンツが他で更新されている。読み直してから保存する")
    this.name = "ConflictError"
  }
}

export function contentTag(name: CollectionName): string {
  return `cms:${name}`
}

export type CollectionSnapshot<N extends CollectionName> = {
  /** Blob 上の版。null はまだ Blob に無い（＝スナップショットを見ている）。 */
  etag: string | null
  data: CollectionData[N]
}

function parseSnapshot<N extends CollectionName>(name: N): CollectionData[N] {
  return collectionSchemas[name].parse(readSnapshot(name)) as CollectionData[N]
}

/**
 * Blob から読み、駄目ならリポジトリのスナップショットへ落ちる。
 *
 * Blob 障害でサイトが 500 になるより、多少古い内容を出し続けるほうがいい。
 * 壊れた JSON がアップロードされた場合も同じ扱いにする。
 */
export async function readCollectionFresh<N extends CollectionName>(
  name: N,
): Promise<CollectionSnapshot<N>> {
  if (isBlobConfigured()) {
    try {
      const blob = await readContentBlob(name)
      if (blob) {
        const parsed = collectionSchemas[name].safeParse(JSON.parse(blob.text))
        if (parsed.success) {
          return { etag: blob.etag, data: parsed.data as CollectionData[N] }
        }
        console.warn(`[cms] ${name} の内容がスキーマに合わないためスナップショットを使う`)
      }
    } catch (error) {
      console.warn(`[cms] ${name} を Blob から読めないためスナップショットを使う`, error)
    }
  }

  return { etag: null, data: parseSnapshot(name) }
}

const cachedReaders = new Map<CollectionName, () => Promise<unknown>>()

function cachedReader(name: CollectionName): () => Promise<unknown> {
  const existing = cachedReaders.get(name)
  if (existing) return existing

  const reader = unstable_cache(
    async () => (await readCollectionFresh(name)).data,
    ["cms", name],
    { tags: [contentTag(name)] },
  )
  cachedReaders.set(name, reader)
  return reader
}

/** サイト表示用。タグ付きでキャッシュされ、保存時の `revalidateTag` で捨てられる。 */
export async function readCollection<N extends CollectionName>(
  name: N,
): Promise<CollectionData[N]> {
  return (await cachedReader(name)()) as CollectionData[N]
}

/**
 * コンテンツを保存する。
 *
 * `ifMatch` は編集開始時に読んだ ETag。現在値と食い違えば `ConflictError`。
 * まだ Blob に無い状態は `null` で表す。
 */
export async function writeCollection<N extends CollectionName>(
  name: N,
  data: unknown,
  ifMatch: string | null,
): Promise<{ etag: string; data: CollectionData[N] }> {
  // 先に内容を検証する。Blob 未設定でも「何が不正か」は返せたほうがいい。
  const validated = collectionSchemas[name].parse(data) as CollectionData[N]

  if (!isBlobConfigured()) throw new BlobNotConfiguredError()

  const current = await readContentBlob(name)
  const currentEtag = current?.etag ?? null
  if (currentEtag !== ifMatch) throw new ConflictError(currentEtag)

  if (current) {
    try {
      await archiveContentBlob(name, current.text)
      await pruneHistory(name)
    } catch (error) {
      // 履歴は保険。失敗しても本体の保存は続ける。
      console.warn(`[cms] ${name} の履歴退避に失敗した`, error)
    }
  }

  const etag = await writeContentBlob(
    name,
    `${JSON.stringify(validated, null, 2)}\n`,
    currentEtag ?? undefined,
  )

  // `"max"` は stale-while-revalidate なので「保存したのにまだ古い」が一度起きる。
  // 保存＝即公開にしたいので即時失効させる（updateTag は Server Action 専用で
  // ここ（Route Handler）からは呼べない）。
  revalidateTag(contentTag(name), { expire: 0 })

  return { etag, data: validated }
}
