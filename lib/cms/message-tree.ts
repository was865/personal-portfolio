/**
 * next-intl の messages は名前空間ごとの入れ子オブジェクト。
 * CMS はそこに「上書きしたい葉だけ」を持つので、木を平らにしたり畳んだりする道具がいる。
 */

export type MessageTree = { [key: string]: string | MessageTree }

export type MessageLeaf = {
  /** ["AboutSection", "desc"] のような位置。 */
  path: string[]
  /** リポジトリ側の既定値。管理画面ではプレースホルダとして出す。 */
  fallback: string
}

function isTree(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** 木の葉をすべて列挙する。順序は定義順を保つ。 */
export function flattenMessages(tree: MessageTree, prefix: string[] = []): MessageLeaf[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [{ path: [...prefix, key], fallback: value }]
      : flattenMessages(value, [...prefix, key]),
  )
}

export function getMessage(tree: MessageTree | undefined, path: string[]): string {
  let current: string | MessageTree | undefined = tree
  for (const key of path) {
    if (!isTree(current)) return ""
    current = current[key]
  }
  return typeof current === "string" ? current : ""
}

/** 指定位置に値を入れた新しい木を返す。空文字を入れるとその枝を消す。 */
export function setMessage(tree: MessageTree, path: string[], value: string): MessageTree {
  const [head, ...rest] = path
  const next: MessageTree = { ...tree }

  if (rest.length === 0) {
    if (value.trim() === "") delete next[head]
    else next[head] = value
    return next
  }

  const child = next[head]
  const updated = setMessage(isTree(child) ? child : {}, rest, value)

  if (Object.keys(updated).length === 0) delete next[head]
  else next[head] = updated

  return next
}
