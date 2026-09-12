import { expect, it } from "vitest"
import { deepMerge } from "./deep-merge"

it("上書きは葉だけ差し替え、隣の値は残す", () => {
  const base = { AboutSection: { desc: "a", para1: "b" } }

  expect(deepMerge(base, { AboutSection: { desc: "z" } })).toEqual({
    AboutSection: { desc: "z", para1: "b" },
  })
})

it("空文字の上書きは無視する（CMS の未入力で本文が消えない）", () => {
  const base = { A: { x: "keep" } }

  expect(deepMerge(base, { A: { x: "" } })).toEqual({ A: { x: "keep" } })
})

it("base に無いキーは追加する", () => {
  expect(deepMerge({ A: { x: "1" } }, { B: { y: "2" } })).toEqual({
    A: { x: "1" },
    B: { y: "2" },
  })
})

it("base を破壊しない", () => {
  const base = { A: { x: "1" } }

  deepMerge(base, { A: { x: "2" } })

  expect(base.A.x).toBe("1")
})

it("上書きが object でなければ base をそのまま返す", () => {
  const base = { A: "1" }

  expect(deepMerge(base, null)).toEqual(base)
  expect(deepMerge(base, "nonsense")).toEqual(base)
})

it("配列は丸ごと差し替える（部分マージしない）", () => {
  expect(deepMerge({ a: [1, 2, 3] }, { a: [9] })).toEqual({ a: [9] })
})
