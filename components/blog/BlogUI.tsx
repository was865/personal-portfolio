'use client'

import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { motion } from "motion/react"
import BackLink from "@/components/BackLink"
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

/** Notion が配信するURLか。サーバ側 fetch が 403 になるので最適化を通さない。 */
function isNotionHosted(src: string) {
  return src.startsWith("https://www.notion.so/")
}

function coverSrc(post: { pageCover: string; block: unknown }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return customMapImageUrl(post.pageCover, post.block as any)
}

/**
 * カバーが使えない記事の下地。記事 id から色相を決めるので、
 * 記事ごとに違い、かつ何度開いても同じ色になる。
 */
function tintFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
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

  // Notion 側で同じページカバーを使い回している記事が多く、一覧に同じ写真が
  // 何枚も並んでいた。2記事以上で共有されている画像は記事を見分ける手がかりに
  // なっていないので、カバーとしては使わず記事ごとの下地に置き換える。
  // 変換後の URL で数える（Notion 側の値が違っても同じ画像を指すことがある）。
  const sharedCovers = useMemo(() => {
    const seen = new Map<string, number>();
    for (const post of blogPosts) {
      if (!post.pageCover) continue;
      const url = coverSrc(post);
      seen.set(url, (seen.get(url) ?? 0) + 1);
    }
    return new Set([...seen].filter(([, n]) => n > 1).map(([url]) => url));
  }, [blogPosts]);

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
    // コンテナの形は詳細ページ（NotionPage）と揃える。
    // 片方だけ padding を max-w の外に置くと、戻るリンクが 16px ずれる。
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <BackLink href={`/${locale}`}>{t("back")}</BackLink>

      <header className="mb-10 mt-6 flex flex-col gap-6">
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
                  "inline-flex h-11 items-center rounded-full px-4 text-[11px] tracking-[0.1em] transition",
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
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ y: 12 }}
        animate={{ y: 0 }}
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
              <div
                className="relative aspect-[16/9] w-full overflow-hidden"
                style={{ backgroundColor: `oklch(0.93 0.035 ${tintFor(post.id)})` }}
              >
                {post.pageCover &&
                !sharedCovers.has(coverSrc(post)) &&
                !brokenCovers.includes(post.id) ? (
                  <Image
                    src={coverSrc(post)}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    quality={75}
                    // Notion はサーバ側の fetch を User-Agent で弾く。
                    // next/image の最適化を通すと 403 になるので、ブラウザに直接読ませる。
                    unoptimized={isNotionHosted(coverSrc(post))}
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
                      "absolute inset-0 flex items-end p-4 text-[12px] tracking-[0.08em] text-black/45",
                    )}
                  >
                    {post.tags[0] ?? ""}
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
        <p className="mt-16 text-center text-sm text-gray-500 dark:text-white/50">
          {t("empty")}
        </p>
      )}
    </div>
  )
}

export default BlogUI
