import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const blobApi = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  list: vi.fn(),
  del: vi.fn(),
}))

const nextCache = vi.hoisted(() => ({ revalidateTag: vi.fn() }))

vi.mock("@vercel/blob", () => blobApi)
vi.mock("next/cache", () => ({
  // キャッシュ層は Next ランタイム外では動かないので素通しにする
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
  revalidateTag: nextCache.revalidateTag,
}))

const { ConflictError, contentTag, readCollectionFresh, writeCollection } = await import("./store")
const { readSnapshot } = await import("./snapshot")

/** `get()` が返す形（statusCode 200 のケース）を組み立てる。 */
function blobResponse(body: unknown, etag: string) {
  return {
    statusCode: 200,
    stream: new Response(JSON.stringify(body)).body,
    blob: { etag },
  }
}

beforeEach(() => {
  process.env.BLOB_READ_WRITE_TOKEN = "test-token"
  blobApi.list.mockResolvedValue({ blobs: [] })
  blobApi.put.mockResolvedValue({ etag: "new-etag" })
})

afterEach(() => {
  vi.clearAllMocks()
  delete process.env.BLOB_READ_WRITE_TOKEN
})

describe("readCollectionFresh", () => {
  it("トークン未設定ならスナップショットを返し、Blob を叩かない", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN

    const result = await readCollectionFresh("projects")

    expect(blobApi.get).not.toHaveBeenCalled()
    expect(result.etag).toBeNull()
    expect(result.data.items.length).toBeGreaterThan(0)
  })

  it("CDN を経由せず origin から読む（保存直後に古い内容を出さない）", async () => {
    blobApi.get.mockResolvedValue(blobResponse(readSnapshot("skills"), "etag-1"))

    await readCollectionFresh("skills")

    expect(blobApi.get).toHaveBeenCalledWith(
      "content/skills.json",
      expect.objectContaining({ useCache: false }),
    )
  })

  it("Blob が落ちてもスナップショットで描画できる", async () => {
    blobApi.get.mockRejectedValue(new Error("network down"))

    const result = await readCollectionFresh("experiences")

    expect(result.etag).toBeNull()
    expect(result.data.items.length).toBeGreaterThan(0)
  })

  it("Blob の内容がスキーマに合わなければスナップショットへ落ちる", async () => {
    blobApi.get.mockResolvedValue(blobResponse({ items: [{ slug: "" }] }, "etag-broken"))

    const result = await readCollectionFresh("projects")

    expect(result.etag).toBeNull()
    expect(result.data.items.length).toBeGreaterThan(0)
  })
})

describe("writeCollection", () => {
  it("etag が食い違えば ConflictError で、何も書かない", async () => {
    blobApi.get.mockResolvedValue(blobResponse(readSnapshot("photos"), "etag-current"))

    await expect(
      writeCollection("photos", readSnapshot("photos"), "etag-stale"),
    ).rejects.toBeInstanceOf(ConflictError)
    expect(blobApi.put).not.toHaveBeenCalled()
  })

  it("Blob に未作成なら etag null で作成できる", async () => {
    blobApi.get.mockResolvedValue(null)

    const result = await writeCollection("photos", readSnapshot("photos"), null)

    expect(result.etag).toBe("new-etag")
    expect(blobApi.put).toHaveBeenCalledTimes(1)
    expect(blobApi.put.mock.calls[0][2]).not.toHaveProperty("ifMatch")
  })

  it("既存があれば履歴へ退避してから ifMatch 付きで上書きする", async () => {
    blobApi.get.mockResolvedValue(blobResponse(readSnapshot("skills"), "etag-current"))

    await writeCollection("skills", readSnapshot("skills"), "etag-current")

    const paths = blobApi.put.mock.calls.map((call) => call[0])
    expect(paths[0]).toMatch(/^content\/_history\/skills\//)
    expect(paths[1]).toBe("content/skills.json")
    expect(blobApi.put.mock.calls[1][2]).toMatchObject({ ifMatch: "etag-current" })
  })

  it("保存後にタグを捨てて即公開する", async () => {
    blobApi.get.mockResolvedValue(null)

    await writeCollection("about", { messages: { ja: {} } }, null)

    expect(nextCache.revalidateTag).toHaveBeenCalledWith(contentTag("about"), { expire: 0 })
  })

  it("スキーマに合わない内容は保存しない", async () => {
    blobApi.get.mockResolvedValue(null)

    await expect(writeCollection("projects", { items: [{ slug: "" }] }, null)).rejects.toThrow()
    expect(blobApi.put).not.toHaveBeenCalled()
  })

  it("トークン未設定なら保存できない", async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN

    await expect(writeCollection("about", { messages: {} }, null)).rejects.toThrow(
      /BLOB_READ_WRITE_TOKEN/,
    )
  })
})
