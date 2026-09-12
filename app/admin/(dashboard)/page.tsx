import Link from "next/link"

import { isBlobConfigured } from "@/lib/cms/blob"
import { readCollectionFresh } from "@/lib/cms/store"

const SECTIONS = [
  { href: "/admin/photos", label: "写真", description: "撮影した写真の追加・並べ替え" },
  { href: "/admin/projects", label: "プロジェクト", description: "事例・スクリーンショット" },
  { href: "/admin/experiences", label: "経歴", description: "職歴・学歴" },
  { href: "/admin/skills", label: "スキル", description: "技術のまとまりとピル" },
  { href: "/admin/about", label: "文言", description: "自己紹介など、画面の文章" },
] as const

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  const connected = isBlobConfigured()
  const [projects, photos] = await Promise.all([
    readCollectionFresh("projects"),
    readCollectionFresh("photos"),
  ])

  return (
    <main>
      <h1 className="mb-1 text-xl font-semibold">サイトの中身</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-white/50">
        保存するとすぐ公開されます。
      </p>

      {!connected && (
        <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
          保存先（Vercel Blob）が未設定です。今はリポジトリ同梱の内容を表示しているだけで、
          保存はできません。<code>BLOB_READ_WRITE_TOKEN</code> を設定してください。
        </p>
      )}

      <ul className="grid gap-3">
        {SECTIONS.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 transition hover:border-gray-400 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30"
            >
              <span>
                <span className="block font-medium">{section.label}</span>
                <span className="block text-sm text-gray-500 dark:text-white/50">
                  {section.description}
                </span>
              </span>
              <span aria-hidden className="text-gray-400">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-gray-400 dark:text-white/30">
        プロジェクト {projects.data.items.length} 件 / 写真 {photos.data.items.length} 枚
      </p>
    </main>
  )
}
