import { expect, it } from "vitest"
import { collectionSchemas, pick } from "./schema"

const L = (s: string) => ({ en: s, ja: s, zh: s })

const validProject = {
  slug: "arag",
  order: 0,
  visible: true,
  title: L("ARag"),
  description: L("desc"),
  tags: ["RAG"],
  caseStudy: { problem: L(""), role: L(""), decisions: L(""), result: L("") },
  shots: [{ image: { url: "/images/a.webp", width: 100, height: 50 }, caption: L("cap") }],
}

it("正しいプロジェクトは通る", () => {
  expect(collectionSchemas.projects.safeParse({ items: [validProject] }).success).toBe(true)
})

it("slug が空のプロジェクトを弾く", () => {
  const r = collectionSchemas.projects.safeParse({ items: [{ ...validProject, slug: "" }] })
  expect(r.success).toBe(false)
})

it("slug に使えない文字を弾く", () => {
  const r = collectionSchemas.projects.safeParse({ items: [{ ...validProject, slug: "A Rag" }] })
  expect(r.success).toBe(false)
})

it("画像の幅高さが欠けていれば弾く（レイアウトシフトの原因になる）", () => {
  const shots = [{ image: { url: "/images/a.webp" }, caption: L("cap") }]
  const r = collectionSchemas.projects.safeParse({ items: [{ ...validProject, shots }] })
  expect(r.success).toBe(false)
})

it("locale が欠けた多言語テキストを弾く", () => {
  const r = collectionSchemas.experiences.safeParse({
    items: [
      {
        id: "a",
        order: 0,
        title: { en: "x", ja: "x" },
        location: L("y"),
        description: L("z"),
        icon: "FaCode",
        date: L("2020"),
      },
    ],
  })
  expect(r.success).toBe(false)
})

it("about は messages の部分木を受け取れる", () => {
  const r = collectionSchemas.about.safeParse({
    messages: { ja: { AboutSection: { desc: "こんにちは" } } },
  })
  expect(r.success).toBe(true)
})

it("about は未知の locale を弾く", () => {
  const r = collectionSchemas.about.safeParse({ messages: { fr: { A: { b: "c" } } } })
  expect(r.success).toBe(false)
})

it("pick は locale ごとの値を返し、未知の locale では en に落ちる", () => {
  const value = { en: "e", ja: "j", zh: "z" }
  expect(pick(value, "ja")).toBe("j")
  expect(pick(value, "zh")).toBe("z")
  expect(pick(value, "fr")).toBe("e")
})
