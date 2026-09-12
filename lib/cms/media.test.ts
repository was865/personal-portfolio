import sharp from "sharp"
import { expect, it } from "vitest"
import { IMAGE_KINDS, processImage } from "./media"

/** 指定サイズの単色 JPEG を作る（テスト入力）。 */
async function makeJpeg(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background: { r: 120, g: 80, b: 40 } },
  })
    .jpeg()
    .toBuffer()
}

it("大きい写真は長辺が上限に収まり webp になる", async () => {
  const result = await processImage(await makeJpeg(3000, 2000), "photo")

  expect(result.width).toBe(IMAGE_KINDS.photo.maxSize)
  expect(result.height).toBe(Math.round((IMAGE_KINDS.photo.maxSize * 2000) / 3000))
  expect((await sharp(result.full).metadata()).format).toBe("webp")
})

it("小さい画像は引き伸ばさない", async () => {
  const result = await processImage(await makeJpeg(300, 200), "photo")

  expect(result.width).toBe(300)
  expect(result.height).toBe(200)
})

it("サムネイルは本体より小さい", async () => {
  const result = await processImage(await makeJpeg(3000, 2000), "photo")
  const thumb = await sharp(result.thumb).metadata()

  expect(thumb.width).toBe(IMAGE_KINDS.photo.thumbSize)
  expect(result.thumb.length).toBeLessThan(result.full.length)
})

it("ぼかしプレースホルダが data URL で返る", async () => {
  const result = await processImage(await makeJpeg(1200, 800), "shot")

  expect(result.blurDataURL.startsWith("data:image/webp;base64,")).toBe(true)
  // ページに直接埋まるので、小さいままであることを保証する
  expect(result.blurDataURL.length).toBeLessThan(2000)
})

it("EXIF の向きを反映して縦横を確定させる", async () => {
  // orientation 6 = 右に 90 度回す必要がある（iPhone の縦位置写真）
  const rotated = await sharp({
    create: { width: 1200, height: 600, channels: 3, background: { r: 10, g: 10, b: 10 } },
  })
    .withMetadata({ orientation: 6 })
    .jpeg()
    .toBuffer()

  const result = await processImage(rotated, "photo")

  expect(result.height).toBeGreaterThan(result.width)
})

it("画像でないデータは分かるエラーになる", async () => {
  await expect(processImage(Buffer.from("not an image"), "photo")).rejects.toThrow(
    /画像として読めない/,
  )
})
