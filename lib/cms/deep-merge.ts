/** プレーンなオブジェクトか。配列・null・クラスインスタンスは含めない。 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * `base` に `override` を重ねた新しいオブジェクトを返す。`base` は変更しない。
 *
 * next-intl の messages（リポジトリ側が既定値）に CMS 側の部分木を重ねるために使う。
 * 空文字・空白のみの上書きは「未入力」とみなして無視する。管理画面で項目を消した拍子に
 * サイトの本文が空になるのを防ぐため。消したいときは既定値そのものを消す。
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) return base

  const merged: Record<string, unknown> = { ...base }

  for (const [key, value] of Object.entries(override)) {
    if (typeof value === "string" && value.trim() === "") continue

    const current = merged[key]
    merged[key] =
      isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value
  }

  return merged as T
}
