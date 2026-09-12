import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CMS",
  // 管理画面は検索結果に出す必要がない
  robots: { index: false, follow: false },
}

/**
 * 管理画面の外枠。サイト側の `[locale]` レイアウトとは別系統なので、
 * ここで html/body から組み立てる（next-intl も theme-context も通さない）。
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* サイト側はクラス方式のダークテーマ。管理画面は端末の設定にそのまま従う。 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-dvh bg-gray-50 text-gray-900 antialiased dark:bg-[#0b0c0e] dark:text-white/90">
        {children}
      </body>
    </html>
  )
}
