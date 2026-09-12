import Link from "next/link"
import { redirect } from "next/navigation"

import { LogoutButton } from "@/components/admin/LogoutButton"
import { requireAuth } from "@/lib/cms/auth"

const NAV = [
  { href: "/admin", label: "ホーム" },
  { href: "/admin/photos", label: "写真" },
  { href: "/admin/projects", label: "プロジェクト" },
  { href: "/admin/experiences", label: "経歴" },
  { href: "/admin/skills", label: "スキル" },
  { href: "/admin/about", label: "文言" },
]

/** 管理画面のうちログインが要る範囲。判定は requireAuth に一本化する。 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await requireAuth())) redirect("/admin/login")

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10">
      <header className="flex items-center justify-between gap-3 py-4">
        <Link href="/admin" className="text-sm font-semibold">
          CMS
        </Link>
        <LogoutButton />
      </header>

      <nav className="-mx-4 mb-6 overflow-x-auto px-4">
        <ul className="flex gap-2 whitespace-nowrap">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-9 items-center rounded-full border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/5"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {children}
    </div>
  )
}
