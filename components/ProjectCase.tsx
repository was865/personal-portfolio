"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import BackLink from "@/components/BackLink"
import { projectsData } from "@/lib/data"
import Lightbox, { type LightboxItem } from "@/components/Lightbox"
import { fontSourceCodePro } from "@/config/fonts"
import { cn } from "@/lib/utils"

type Project = (typeof projectsData)[number]

type ProjectCaseProps = {
  project: Project
  prev: Pick<Project, "slug" | "title" | "title_ja" | "title_zh"> | null
  next: Pick<Project, "slug" | "title" | "title_ja" | "title_zh"> | null
}

function pick(locale: string, en: string, ja: string, zh: string) {
  return locale === "zh" ? zh : locale === "ja" ? ja : en
}

/** 大きく見せる枚数。残りはサムネイルからビューアで開く。 */
const LEAD_SHOTS = 2

export default function ProjectCase({ project, prev, next }: ProjectCaseProps) {
  const locale = useLocale()
  const t = useTranslations("ProjectsSection")
  const [openAt, setOpenAt] = useState<number | null>(null)

  const title = pick(locale, project.title, project.title_ja, project.title_zh)
  const description = pick(locale, project.description, project.desc_ja, project.desc_zh)

  // 空欄（まだ書いていない項目）は行ごと出さない。
  const cs = project.caseStudy
  const caseRows: [string, string][] = (
    [
      [t("case_problem"), pick(locale, cs.problem.en, cs.problem.ja, cs.problem.zh)],
      [t("case_role"), pick(locale, cs.role.en, cs.role.ja, cs.role.zh)],
      [t("case_decision"), pick(locale, cs.decisions.en, cs.decisions.ja, cs.decisions.zh)],
      [t("case_result"), pick(locale, cs.result.en, cs.result.ja, cs.result.zh)],
    ] as [string, string][]
  ).filter(([, v]) => v.trim().length > 0)

  const items: LightboxItem[] = project.shots.map((shot) => ({
    src: shot.src,
    caption: pick(locale, shot.caption.en, shot.caption.ja, shot.caption.zh),
  }))

  return (
    <article className="mx-auto w-full max-w-5xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
      <BackLink href={`/${locale}#projects`}>{t("back")}</BackLink>

      <header className="mt-6 border-b border-black/10 pb-8 dark:border-white/10">
        <h1 className="max-w-3xl text-2xl font-semibold leading-tight text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl leading-relaxed text-gray-700 dark:text-white/70">
          {description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white dark:bg-white/10 dark:text-white/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* スクリーンショットだけでは「何を解いたのか」「結果どうだったか」が
          伝わらない。図版の前に事例の骨格を置く。中身が空の行は出さない。 */}
      {caseRows.length > 0 && (
        <dl className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-[5.5rem_1fr]">
          {caseRows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt
                className={cn(
                  fontSourceCodePro.className,
                  "text-[11px] tracking-[0.16em] text-gray-500 sm:pt-1 dark:text-white/45",
                )}
              >
                {label}
              </dt>
              <dd className="m-0 max-w-2xl leading-relaxed text-gray-700 dark:text-white/75">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* 画面：番号・キャプション・大きな図版。クリックでビューア。 */}
      <section className="mt-14">
        <h2
          className={cn(
            fontSourceCodePro.className,
            "mb-8 text-[11px] tracking-[0.18em] text-gray-500 dark:text-white/45",
          )}
        >
          {t("gallery")}（{project.shots.length}）
        </h2>

        <ol className="space-y-14">
          {items.slice(0, LEAD_SHOTS).map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpenAt(i)}
                aria-label={`${t("open_viewer")}：${item.caption}`}
                className={cn(
                  "group block w-full cursor-zoom-in text-left",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9882a]",
                )}
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <span
                    className={cn(
                      fontSourceCodePro.className,
                      // #e9882a は薄い下地の上で 2.36:1 しかなく読めない
                      "shrink-0 text-[11px] tabular-nums tracking-[0.14em]",
                      "text-gray-500 dark:text-white/45",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-snug text-gray-700 dark:text-white/70">
                    {item.caption}
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_10px_40px_-28px_rgba(0,0,0,0.6)] transition group-hover:border-[#e9882a]/60 dark:border-white/10 dark:bg-white/5">
                  <Image
                    src={item.src}
                    alt={item.caption}
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    quality={80}
                    placeholder="blur"
                    className="h-auto w-full"
                  />
                </div>
              </button>
            </li>
          ))}
        </ol>

        {/* 残りは縮めて並べる。押せばビューアでその位置から見られる。 */}
        {items.length > LEAD_SHOTS && (
          <ul className="mt-10 flex flex-wrap gap-3">
            {items.slice(LEAD_SHOTS).map((item, i) => {
              const index = i + LEAD_SHOTS
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => setOpenAt(index)}
                    aria-label={`${t("open_viewer")}：${item.caption}`}
                    className={cn(
                      "relative block h-16 w-28 overflow-hidden rounded-lg border border-black/10 transition",
                      "hover:border-[#e9882a]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a]",
                      "dark:border-white/10",
                    )}
                  >
                    <Image
                      src={item.src}
                      alt={item.caption}
                      fill
                      sizes="160px"
                      quality={70}
                      className="object-cover object-left-top"
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {(prev || next) && (
        <nav className="mt-20 grid gap-3 border-t border-black/10 pt-8 sm:grid-cols-2 dark:border-white/10">
          {prev ? (
            <Link
              href={`/${locale}/projects/${prev.slug}`}
              className="group rounded-xl border border-black/10 p-4 transition hover:border-[#e9882a]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:border-white/10"
            >
              <span
                className={cn(
                  fontSourceCodePro.className,
                  "flex items-center gap-1 text-[10px] tracking-[0.14em] text-gray-500 dark:text-white/45",
                )}
              >
                <HiChevronLeft className="h-3.5 w-3.5" /> PREV
              </span>
              <span className="mt-1.5 block text-sm text-gray-800 transition group-hover:text-[#e9882a] dark:text-white/80 dark:group-hover:text-yellow">
                {pick(locale, prev.title, prev.title_ja, prev.title_zh)}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={`/${locale}/projects/${next.slug}`}
              className="group rounded-xl border border-black/10 p-4 text-right transition hover:border-[#e9882a]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:border-white/10"
            >
              <span
                className={cn(
                  fontSourceCodePro.className,
                  "flex items-center justify-end gap-1 text-[10px] tracking-[0.14em] text-gray-500 dark:text-white/45",
                )}
              >
                NEXT <HiChevronRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-1.5 block text-sm text-gray-800 transition group-hover:text-[#e9882a] dark:text-white/80 dark:group-hover:text-yellow">
                {pick(locale, next.title, next.title_ja, next.title_zh)}
              </span>
            </Link>
          )}
        </nav>
      )}

      <Lightbox
        items={items}
        index={openAt ?? 0}
        onIndexChange={setOpenAt}
        open={openAt !== null}
        onClose={() => setOpenAt(null)}
        title={title}
      />
    </article>
  )
}
