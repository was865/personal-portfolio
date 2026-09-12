"use client"

import { useState } from "react"

import { useCollection } from "@/components/admin/useCollection"
import {
  AdminLocaleProvider,
  Card,
  LocaleTabs,
  SaveBar,
  TextInput,
  useAdminLocale,
} from "@/components/admin/ui"
import en from "@/messages/en.json"
import ja from "@/messages/ja.json"
import zh from "@/messages/zh.json"
import {
  flattenMessages,
  getMessage,
  setMessage,
  type MessageTree,
} from "@/lib/cms/message-tree"
import type { Locale } from "@/lib/cms/schema"

/** 既定値はリポジトリの messages。CMS はこの上に差分だけを載せる。 */
const BASE: Record<Locale, MessageTree> = {
  ja: ja as MessageTree,
  zh: zh as MessageTree,
  en: en as MessageTree,
}

/** 最初に開いておく名前空間。自己紹介まわりが主な用途なので。 */
const OPEN_BY_DEFAULT = new Set(["AboutSection", "IntroSection"])

/** 長い本文は複数行で編集したい。 */
const MULTILINE_KEYS = new Set(["desc", "para1", "para2", "para3", "para4", "intro_end"])

export default function AboutPage() {
  return (
    <AdminLocaleProvider>
      <Editor />
    </AdminLocaleProvider>
  )
}

function Editor() {
  const { status, data, dirty, saving, error, setData, save, reload } = useCollection("about")
  const { locale } = useAdminLocale()
  const [open, setOpen] = useState<Set<string>>(OPEN_BY_DEFAULT)

  if (status === "loading" || !data) return <p className="py-10 text-sm">読み込み中…</p>

  const overrides = data.messages?.[locale] ?? {}
  const namespaces = Object.keys(BASE[locale])

  const update = (path: string[], value: string) =>
    setData((current) => ({
      ...current,
      messages: {
        ...current.messages,
        [locale]: setMessage((current.messages?.[locale] ?? {}) as MessageTree, path, value),
      },
    }))

  return (
    <main>
      <h1 className="mb-1 text-xl font-semibold">文言</h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-white/50">
        空欄のままならコードに入っている既定の文言（薄い文字）が出ます。書き換えたいものだけ入力してください。
      </p>

      <div className="mb-4">
        <LocaleTabs />
      </div>

      <div className="space-y-3">
        {namespaces.map((namespace) => {
          const leaves = flattenMessages(BASE[locale][namespace] as MessageTree, [namespace])
          const changed = leaves.filter(
            (leaf) => getMessage(overrides as MessageTree, leaf.path) !== "",
          ).length
          const isOpen = open.has(namespace)

          return (
            <Card key={namespace} className="p-0">
              <button
                type="button"
                onClick={() =>
                  setOpen((current) => {
                    const next = new Set(current)
                    if (next.has(namespace)) next.delete(namespace)
                    else next.add(namespace)
                    return next
                  })
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium">{namespace}</span>
                <span className="text-xs text-gray-500 dark:text-white/40">
                  {changed > 0 ? `${changed} 件を上書き中` : "既定のまま"} {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-gray-200 px-4 py-4 dark:border-white/10">
                  {leaves.map((leaf) => {
                    const key = leaf.path[leaf.path.length - 1]
                    return (
                      <label key={leaf.path.join(".")} className="block">
                        <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-white/50">
                          {key}
                        </span>
                        <TextInput
                          value={getMessage(overrides as MessageTree, leaf.path)}
                          placeholder={leaf.fallback}
                          multiline={MULTILINE_KEYS.has(key)}
                          rows={4}
                          onChange={(value) => update(leaf.path, value)}
                        />
                      </label>
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}
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
