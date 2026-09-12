"use client"

import Link from "next/link"
import { useState } from "react"

import { moveItem, useCollection } from "@/components/admin/useCollection"
import {
  AdminLocaleProvider,
  Button,
  Card,
  Field,
  LocaleTabs,
  MoveButtons,
  SaveBar,
  TextInput,
  useAdminLocale,
} from "@/components/admin/ui"
import { byOrder, pick, type L, type Project } from "@/lib/cms/schema"

const EMPTY: L<string> = { en: "", ja: "", zh: "" }

function newProject(slug: string, order: number): Project {
  return {
    slug,
    order,
    visible: true,
    title: { ...EMPTY },
    description: { ...EMPTY },
    tags: [],
    caseStudy: {
      problem: { ...EMPTY },
      role: { ...EMPTY },
      decisions: { ...EMPTY },
      result: { ...EMPTY },
    },
    shots: [],
  }
}

export default function ProjectsPage() {
  return (
    <AdminLocaleProvider>
      <List />
    </AdminLocaleProvider>
  )
}

function List() {
  const { status, data, dirty, saving, error, setData, save, reload } = useCollection("projects")
  const { locale } = useAdminLocale()
  const [slug, setSlug] = useState("")
  const [slugError, setSlugError] = useState<string | null>(null)

  if (status === "loading" || !data) return <p className="py-10 text-sm">読み込み中…</p>

  const items = byOrder(data.items)

  function addProject() {
    const value = slug.trim().toLowerCase()
    if (!/^[a-z0-9-]+$/.test(value)) {
      setSlugError("小文字の英数字とハイフンだけが使えます")
      return
    }
    if (items.some((item) => item.slug === value)) {
      setSlugError("その URL 名はもう使われています")
      return
    }

    setSlugError(null)
    setSlug("")
    setData((current) => ({
      ...current,
      items: [newProject(value, -1), ...byOrder(current.items)].map((item, order) => ({
        ...item,
        order,
      })),
    }))
  }

  return (
    <main>
      <h1 className="mb-1 text-xl font-semibold">プロジェクト</h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-white/50">
        並び順と公開／非公開はここで。中身は各行の「編集」から。
      </p>

      <div className="mb-4">
        <LocaleTabs />
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={item.slug}>
            <Card className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{pick(item.title, locale) || item.slug}</p>
                <p className="truncate text-xs text-gray-500 dark:text-white/40">
                  /{item.slug} · 画面 {item.shots.length} 枚
                </p>
              </div>

              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      items: current.items.map((entry) =>
                        entry.slug === item.slug
                          ? { ...entry, visible: event.target.checked }
                          : entry,
                      ),
                    }))
                  }
                  className="h-4 w-4"
                />
                公開
              </label>

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

              <Link
                href={`/admin/projects/${item.slug}`}
                className="inline-flex min-h-9 items-center rounded-lg border border-gray-300 px-3 text-sm dark:border-white/15"
              >
                編集
              </Link>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="mt-5 space-y-3">
        <Field label="新しいプロジェクトを追加" hint="URL に使う名前（例: my-new-app）">
          <TextInput value={slug} onChange={setSlug} placeholder="my-new-app" />
        </Field>
        {slugError && <p className="text-sm text-red-600 dark:text-red-400">{slugError}</p>}
        <Button onClick={addProject} disabled={slug.trim().length === 0}>
          追加する
        </Button>
      </Card>

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
