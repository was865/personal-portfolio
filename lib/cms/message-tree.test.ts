import { expect, it } from "vitest"
import ja from "@/messages/ja.json"
import { flattenMessages, getMessage, setMessage, type MessageTree } from "./message-tree"

const tree: MessageTree = {
  AboutSection: { desc: "あいさつ", para1: "本文" },
  Header: { home: "ホーム" },
}

it("葉をすべて列挙する", () => {
  expect(flattenMessages(tree)).toEqual([
    { path: ["AboutSection", "desc"], fallback: "あいさつ" },
    { path: ["AboutSection", "para1"], fallback: "本文" },
    { path: ["Header", "home"], fallback: "ホーム" },
  ])
})

it("実際の messages/ja.json を平らにできる", () => {
  const leaves = flattenMessages(ja as MessageTree)

  expect(leaves.length).toBeGreaterThan(20)
  expect(leaves.every((leaf) => typeof leaf.fallback === "string")).toBe(true)
})

it("位置を指定して値を読める。無ければ空文字", () => {
  expect(getMessage(tree, ["AboutSection", "desc"])).toBe("あいさつ")
  expect(getMessage(tree, ["AboutSection", "nope"])).toBe("")
  expect(getMessage(undefined, ["A"])).toBe("")
})

it("値を入れても元の木は変わらない", () => {
  const next = setMessage(tree, ["AboutSection", "desc"], "新しい挨拶")

  expect(getMessage(next, ["AboutSection", "desc"])).toBe("新しい挨拶")
  expect(getMessage(tree, ["AboutSection", "desc"])).toBe("あいさつ")
})

it("無かった枝にも書ける", () => {
  const next = setMessage({}, ["New", "deep", "key"], "値")

  expect(getMessage(next, ["New", "deep", "key"])).toBe("値")
})

it("空文字を入れると枝ごと消える（既定値に戻す操作）", () => {
  const withOverride = setMessage({}, ["AboutSection", "desc"], "上書き")
  const cleared = setMessage(withOverride, ["AboutSection", "desc"], "")

  expect(cleared).toEqual({})
})

it("空白だけの入力も未入力として扱う", () => {
  expect(setMessage(tree, ["Header", "home"], "   ")).toEqual({
    AboutSection: { desc: "あいさつ", para1: "本文" },
  })
})
