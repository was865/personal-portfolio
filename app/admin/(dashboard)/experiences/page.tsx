"use client"

import { randomId } from "@/components/admin/randomId"
import { moveItem, useCollection } from "@/components/admin/useCollection"
import {
  AdminLocaleProvider,
  Button,
  Card,
  Field,
  IconSelect,
  LocaleTabs,
  LocalizedField,
  MoveButtons,
  SaveBar,
  useAdminLocale,
} from "@/components/admin/ui"
import { resolveIcon } from "@/config/icon-registry"
import { byOrder, pick, type Experience, type L } from "@/lib/cms/schema"

const EMPTY: L<string> = { en: "", ja: "", zh: "" }

function newExperience(order: number): Experience {
  return {
    id: randomId(),
    order,
    title: { ...EMPTY },
    location: { ...EMPTY },
    description: { ...EMPTY },
    icon: "FaCode",
    date: { ...EMPTY },
  }
}

export default function ExperiencesPage() {
  return (
    <AdminLocaleProvider>
      <Editor />
    </AdminLocaleProvider>
  )
}

function Editor() {
  const { status, data, dirty, saving, error, setData, save, reload } = useCollection("experiences")
  const { locale } = useAdminLocale()

  if (status === "loading" || !data) return <p className="py-10 text-sm">読み込み中…</p>

  const items = byOrder(data.items)

  const update = (id: string, patch: Partial<Experience>) =>
    setData((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  return (
    <main>
      <h1 className="mb-1 text-xl font-semibold">経歴</h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-white/50">
        上にあるものほど新しい経歴として表示されます。
      </p>

      <div className="mb-4">
        <LocaleTabs />
      </div>

      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50">
                  <span className="text-lg">{resolveIcon(item.icon)}</span>
                  {pick(item.title, locale) || "（無題）"}
                </span>
                <MoveButtons
                  index={index}
                  count={items.length}
                  onMove={(from, to) =>
                    setData((current) => ({
                      ...current,
                      items: moveItem(byOrder(current.items), from, to),
                    }))
                  }
                />
              </div>

              <LocalizedField
                label="組織・学校"
                value={item.title}
                onChange={(title) => update(item.id, { title })}
              />
              <LocalizedField
                label="役割"
                value={item.location}
                onChange={(location) => update(item.id, { location })}
              />
              <LocalizedField
                label="期間"
                value={item.date}
                onChange={(date) => update(item.id, { date })}
                placeholder="2023年1月 - 2026年7月"
              />
              <LocalizedField
                label="説明"
                value={item.description}
                onChange={(description) => update(item.id, { description })}
                multiline
                rows={5}
              />
              <Field label="アイコン">
                <IconSelect value={item.icon} onChange={(icon) => update(item.id, { icon })} />
              </Field>

              <Button
                variant="danger"
                onClick={() =>
                  setData((current) => ({
                    ...current,
                    items: byOrder(current.items)
                      .filter((entry) => entry.id !== item.id)
                      .map((entry, order) => ({ ...entry, order })),
                  }))
                }
              >
                この経歴を削除
              </Button>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Button
          onClick={() =>
            setData((current) => ({
              ...current,
              items: [newExperience(-1), ...byOrder(current.items)].map((item, order) => ({
                ...item,
                order,
              })),
            }))
          }
        >
          経歴を追加
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
  )
}
