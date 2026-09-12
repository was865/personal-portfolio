import sharp from "sharp"

/**
 * 種類ごとの上限。原本をそのまま置くと iPhone の写真は 1 枚 5MB 近くあり、
 * 転送量も表示も重い。長辺だけ決めて縦横比は保つ。
 */
export const IMAGE_KINDS = {
  photo: { maxSize: 2000, thumbSize: 640, quality: 82 },
  shot: { maxSize: 1800, thumbSize: 560, quality: 82 },
} as const

export type ImageKind = keyof typeof IMAGE_KINDS

export type ProcessedImage = {
  full: Buffer
  thumb: Buffer
  width: number
  height: number
  blurDataURL: string
}

/** ぼかしは 12px 幅。ページに直接埋まるので小さく保つ。 */
const BLUR_WIDTH = 12

export async function processImage(input: Buffer, kind: ImageKind): Promise<ProcessedImage> {
  const { maxSize, thumbSize, quality } = IMAGE_KINDS[kind]

  // rotate() は EXIF の向きを画素に焼き込む。これを忘れると iPhone の縦写真が横になる。
  const normalized = sharp(input).rotate()

  let metadata
  try {
    metadata = await normalized.metadata()
  } catch {
    throw new Error("画像として読めない。JPEG / PNG / WebP で保存し直す")
  }
  if (!metadata.width || !metadata.height) {
    throw new Error("画像として読めない。JPEG / PNG / WebP で保存し直す")
  }

  const full = await normalized
    .clone()
    .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()

  const fullMeta = await sharp(full).metadata()

  const thumb = await normalized
    .clone()
    .resize({ width: thumbSize, height: thumbSize, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 70 })
    .toBuffer()

  const blur = await normalized
    .clone()
    .resize({ width: BLUR_WIDTH, fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer()

  return {
    full,
    thumb,
    width: fullMeta.width ?? metadata.width,
    height: fullMeta.height ?? metadata.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  }
}
