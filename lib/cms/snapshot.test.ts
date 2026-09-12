import { expect, it } from "vitest"
import { COLLECTION_NAMES, collectionSchemas, type CollectionName } from "./schema"
import { readSnapshot } from "./snapshot"

it.each(COLLECTION_NAMES)("%s のスナップショットはスキーマを通る", (name: CollectionName) => {
  const result = collectionSchemas[name].safeParse(readSnapshot(name))

  if (!result.success) console.error(name, result.error.issues.slice(0, 5))
  expect(result.success).toBe(true)
})

it("プロジェクトの slug が重複していない", () => {
  const data = collectionSchemas.projects.parse(readSnapshot("projects"))
  const slugs = data.items.map((item) => item.slug)

  expect(new Set(slugs).size).toBe(slugs.length)
})

it("スキルのグループが指す id はすべて存在する", () => {
  const data = collectionSchemas.skills.parse(readSnapshot("skills"))
  const ids = new Set(data.items.map((item) => item.id))

  const missing = data.groups.flatMap((group) => group.ids.filter((id) => !ids.has(id)))
  expect(missing).toEqual([])
})
