"use client"

import { useCollection } from "@/components/admin/useCollection"
import {
  AdminLocaleProvider,
  Button,
  Card,
  Field,
  IconSelect,
  LocaleTabs,
  LocalizedField,
  SaveBar,
  TextInput,
} from "@/components/admin/ui"
import { resolveIcon } from "@/config/icon-registry"
import type { L, Skill } from "@/lib/cms/schema"

const EMPTY: L<string> = { en: "", ja: "", zh: "" }

/** グループの見出しは messages の SkillsSection にある。ここでは鍵だけ扱う。 */
const GROUP_HINT = "messages の SkillsSection にある鍵（group_ai など）"

export default function SkillsPage() {
  const { status, data, dirty, saving, error, setData, save, reload } = useCollection("skills")

  if (status === "loading" || !data) return <p className="py-10 text-sm">読み込み中…</p>

  const itemById = new Map(data.items.map((item) => [item.id, item]))

  const updateItem = (id: string, patch: Partial<Skill>) =>
    setData((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const moveInGroup = (groupIndex: number, from: number, to: number) =>
    setData((current) => ({
      ...current,
      groups: current.groups.map((group, index) => {
        if (index !== groupIndex || to < 0 || to >= group.ids.length) return group
        const ids = [...group.ids]
        const [moved] = ids.splice(from, 1)
        ids.splice(to, 0, moved)
        return { ...group, ids }
      }),
    }))

  return (
    <AdminLocaleProvider>
      <main>
        <h1 className="mb-1 text-xl font-semibold">スキル</h1>
        <p className="mb-4 text-sm text-gray-500 dark:text-white/50">
          上のグループほど画面の上に出ます。グループに入れていないスキルは表示されません。
        </p>

        <div className="mb-4">
          <LocaleTabs />
        </div>

        <h2 className="mb-2 text-sm font-semibold">グループ</h2>
        <ul className="mb-8 space-y-3">
          {data.groups.map((group, groupIndex) => (
            <li key={group.key}>
              <Card className="space-y-3">
                <Field label="グループの鍵" hint={GROUP_HINT}>
                  <TextInput
                    value={group.key}
                    onChange={(key) =>
                      setData((current) => ({
                        ...current,
                        groups: current.groups.map((entry, index) =>
                          index === groupIndex ? { ...entry, key } : entry,
                        ),
                      }))
                    }
                  />
                </Field>

                <ul className="flex flex-wrap gap-2">
                  {group.ids.map((id, idIndex) => (
                    <li
                      key={id}
                      className="flex items-center gap-1 rounded-full border border-gray-300 bg-white py-1 pl-3 pr-1 text-sm dark:border-white/15 dark:bg-white/5"
                    >
                      <span className={itemById.has(id) ? "" : "text-red-600 dark:text-red-400"}>
                        {itemById.get(id)?.name ?? `${id}（未定義）`}
                      </span>
                      <button
                        type="button"
                        aria-label={`${id} を左へ`}
                        disabled={idIndex === 0}
                        onClick={() => moveInGroup(groupIndex, idIndex, idIndex - 1)}
                        className="px-1 text-gray-400 disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        aria-label={`${id} を右へ`}
                        disabled={idIndex === group.ids.length - 1}
                        onClick={() => moveInGroup(groupIndex, idIndex, idIndex + 1)}
                        className="px-1 text-gray-400 disabled:opacity-30"
                      >
                        →
                      </button>
                      <button
                        type="button"
                        aria-label={`${id} を外す`}
                        onClick={() =>
                          setData((current) => ({
                            ...current,
                            groups: current.groups.map((entry, index) =>
                              index === groupIndex
                                ? { ...entry, ids: entry.ids.filter((value) => value !== id) }
                                : entry,
                            ),
                          }))
                        }
                        className="px-1.5 text-gray-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>

                <select
                  value=""
                  onChange={(event) => {
                    const id = event.target.value
                    if (!id) return
                    setData((current) => ({
                      ...current,
                      groups: current.groups.map((entry, index) =>
                        index === groupIndex && !entry.ids.includes(id)
                          ? { ...entry, ids: [...entry.ids, id] }
                          : entry,
                      ),
                    }))
                  }}
                  className="w-full min-h-11 rounded-lg border border-gray-300 bg-white px-3 dark:border-white/15 dark:bg-white/5"
                >
                  <option value="">このグループに追加…</option>
                  {data.items
                    .filter((item) => !group.ids.includes(item.id))
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </Card>
            </li>
          ))}
        </ul>

        <h2 className="mb-2 text-sm font-semibold">スキル一覧</h2>
        <ul className="space-y-3">
          {data.items.map((item) => (
            <li key={item.id}>
              <Card className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50">
                  <span className="text-lg">{resolveIcon(item.icon)}</span>
                  <code className="text-xs">{item.id}</code>
                </div>

                <Field label="表示名">
                  <TextInput value={item.name} onChange={(name) => updateItem(item.id, { name })} />
                </Field>
                <LocalizedField
                  label="説明（ホバーで出る一行）"
                  value={item.desc}
                  onChange={(desc) => updateItem(item.id, { desc })}
                />
                <Field label="アイコン">
                  <IconSelect value={item.icon} onChange={(icon) => updateItem(item.id, { icon })} />
                </Field>

                <Button
                  variant="danger"
                  onClick={() =>
                    setData((current) => ({
                      ...current,
                      items: current.items.filter((entry) => entry.id !== item.id),
                      groups: current.groups.map((group) => ({
                        ...group,
                        ids: group.ids.filter((id) => id !== item.id),
                      })),
                    }))
                  }
                >
                  このスキルを削除
                </Button>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Button
            onClick={() =>
              setData((current) => {
                const id = `skill-${current.items.length + 1}`
                return {
                  ...current,
                  items: [
                    ...current.items,
                    { id, name: "新しいスキル", icon: "FaCode", desc: { ...EMPTY } },
                  ],
                }
              })
            }
          >
            スキルを追加
          </Button>
        </div>

        <SaveBar
          dirty={dirty}
          saving={saving}
          error={error}
          onSave={() => void save()}
          onReload={() => void reload()}
        />
      </main>
    </AdminLocaleProvider>
  )
}
