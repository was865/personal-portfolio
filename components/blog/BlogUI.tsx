'use client'

import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { motion } from "motion/react"
import { HiChevronLeft } from "react-icons/hi"
import { useTranslations } from "next-intl"
import { customMapImageUrl } from "@/lib/notion"
import { extractTags, getTitleWithoutTags, detectContentLang, type ContentLang } from "@/lib/utils"
import { fontSourceCodePro } from "@/config/fonts"
import { cn } from "@/lib/utils"

type BlogPost = {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: any
  title: string
  pageCover: string
  createdAt: Date
}

interface BlogUIProps {
  blogPosts: BlogPost[]
  locale: string
}

type Filter = "all" | ContentLang

const FILTER_ORDER: Filter[] = ["all", "ja", "zh", "en"]

/** UI の言語を、記事の言語フィルタの初期値に写す。 */
function initialFilter(locale: string): Filter {
  if (locale === "ja" || locale === "zh" || locale === "en") return locale
  return "all"
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

const BlogUI = ({ blogPosts, locale }: BlogUIProps) => {
  const t = useTranslations("Blog")
  const [filter, setFilter] = useState<Filter>(() => initialFilter(locale))
  // Notion 経由のカバーは 403 で落ちることがある。落ちた記事は id で覚えて
  // 空の箱ではなく穏やかな下地を出す。
  const [brokenCovers, setBrokenCovers] = useState<string[]>([])

  // 記事ごとに表記言語を1回だけ判定しておく。
  const posts = useMemo(
    () =>
      blogPosts.map((post) => {
        const cleanTitle = getTitleWithoutTags(post.title)
        return {
          ...post,
          cleanTitle,
          tags: extractTags(post.title),
          lang: detectContentLang(cleanTitle),
        }
      }),
    [blogPosts],
  )

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: posts.length, ja: 0, zh: 0, en: 0 }
    posts.forEach((p) => { c[p.lang] += 1 })
    return c
  }, [posts])

  const visible = filter === "all" ? posts : posts.filter((p) => p.lang === filter)

  return (
    <div className="px-4 pb-16">
      <header className="mx-auto mb-10 flex max-w-6xl flex-col gap-6">
        <Link
          href={`/${locale}`}
          prefetch={true}
          className={cn(
            fontSourceCodePro.className,
            "inline-flex w-fit items-center gap-1 text-[11px] tracking-[0.14em] text-gray-500 transition",
            "hover:text-[#e9882a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a]",
            "dark:text-white/50 dark:hover:text-yellow",
          )}
        >
          <HiChevronLeft className="h-4 w-4" />
          {t("back")}
        </Link>

        <div>
          <h1 className="text-2xl font-medium sm:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-white/50">{t("description")}</p>
        </div>

        {/* 記事の言語で絞る。同じ記事の翻訳版が並ぶので、既定は UI の言語。 */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("filter_label")}>
          {FILTER_ORDER.filter((f) => f === "all" || counts[f] > 0).map((f) => {
            const active = filter === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  fontSourceCodePro.className,
                  "rounded-full px-3 py-1.5 text-[11px] tracking-[0.1em] transition",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a]",
                  active
                    ? "bg-[#e9882a] text-white"
                    : "bg-black/5 text-gray-600 hover:bg-black/10 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20",
                )}
              >
                {t(`filter_${f}`)} {counts[f]}
              </button>
            )
          })}
        </div>
      </header>

      <motion.ul
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {visible.map((post) => (
          <li key={post.id}>
            <Link
              href={`/${locale}/blog/${post.id}`}
              className={cn(
                "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition",
                "hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9882a]",
                "dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20",
              )}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#ffe9c9] to-[#e8eaea] dark:from-[#2a2320] dark:to-[#161a1c]">
                {post.pageCover && !brokenCovers.includes(post.id) ? (
                  <Image
                    src={customMapImageUrl(post.pageCover, post.block)}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    quality={75}
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    onError={() =>
                      setBrokenCovers((prev) => (prev.includes(post.id) ? prev : [...prev, post.id]))
                    }
                  />
                ) : (
                  <span
                    aria-hidden
                    className={cn(
                      fontSourceCodePro.className,
                      "absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.2em] text-black/25 dark:text-white/25",
                    )}
                  >
                    {post.tags[0]?.toUpperCase() ?? "NOTE"}
                  </span>
                )}
              </div>

              {/* タイトルはカバー画像の上に載せない。読みやすさが画像に左右されるため。 */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <time
                  dateTime={new Date(post.createdAt).toISOString()}
                  className={cn(
                    fontSourceCodePro.className,
                    "text-[11px] tracking-[0.12em] text-gray-500 dark:text-white/45",
                  )}
                >
                  {formatDate(post.createdAt, locale)}
                </time>

                {/* 記事の言語を要素に持たせて、UI の言語ではなく記事の言語で字形を決める。 */}
                <h2
                  lang={post.lang}
                  className="text-[15px] font-bold leading-snug text-gray-900 transition group-hover:text-[#e9882a] dark:text-white dark:group-hover:text-yellow"
                >
                  {post.cleanTitle}
                </h2>

                {post.tags.length > 0 && (
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, i) => (
                      <li
                        key={i}
                        className="rounded-md bg-black/[0.06] px-2 py-0.5 text-[11px] text-gray-600 dark:bg-white/10 dark:text-white/60"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          </li>
        ))}
      </motion.ul>

      {visible.length === 0 && (
        <p className="mx-auto mt-16 max-w-6xl text-center text-sm text-gray-500 dark:text-white/50">
          {t("empty")}
        </p>
      )}
    </div>
  )
}

export default BlogUI
