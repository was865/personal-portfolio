import { expect, it } from "vitest"
import experiences from "@/content/experiences.json"
import skills from "@/content/skills.json"
import { ICON_NAMES, isIconName, resolveIcon } from "./icon-registry"

it("未知のアイコン名でも落ちず既定アイコンを返す", () => {
  expect(resolveIcon("NoSuchIcon")).toBeTruthy()
  expect(isIconName("NoSuchIcon")).toBe(false)
})

it("className をアイコンへ渡す", () => {
  expect(resolveIcon("FaCode", "text-xl").props).toMatchObject({ className: "text-xl" })
})

it("コンテンツが使うアイコンはすべて登録されている", () => {
  const used = [
    ...experiences.items.map((item) => item.icon),
    ...skills.items.map((item) => item.icon),
  ]

  expect(used.filter((name) => !isIconName(name))).toEqual([])
})

it("管理画面に出す選択肢は名前順で重複がない", () => {
  expect(ICON_NAMES).toEqual([...ICON_NAMES].sort())
  expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length)
})
