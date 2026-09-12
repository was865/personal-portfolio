"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import BackLink from "@/components/BackLink"
import Lightbox, { type LightboxItem } from "@/components/Lightbox"
import { fontSourceCodePro } from "@/config/fonts"
import { cn } from "@/lib/utils"
import { pick, type Project } from "@/lib/cms/schema"

/** 前後リンクに必要なのは行き先と見出しだけ。 */
export type ProjectLink = Pick<Project, "slug" | "title">

type ProjectCaseProps = {
  project: Project
  prev: ProjectLink | null
  next: ProjectLink | null
}

/** blurDataURL を持つ画像だけ blur プレースホルダにする。無い画像でも壊さない。 */
function blurProps(image: Project["shots"][number]["image"]) {
  return image.blurDataURL
    ? ({ placeholder: "blur", blurDataURL: image.blurDataURL } as const)
    : {}
}

/** 大きく見せる枚数。残りは小さいカードにするが、番号と説明は最後まで出す。 */
const LEAD_SHOTS = 2

/** 図版の見出し。番号は通し（01…07）で、カードの大小にかかわらず続ける。 */
function ShotLabel({ n, caption }: { n: number; caption: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-3">
      <span
        className={cn(
          fontSourceCodePro.className,
          // #e9882a は薄い下地の上で 2.36:1 しかなく読めない
          "shrink-0 text-[11px] tabular-nums tracking-[0.14em]",
          "text-gray-500 dark:text-white/45",
        )}
      >
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-sm leading-snug text-gray-700 dark:text-white/70">{caption}</span>
    </div>
  )
}

export default function ProjectCase({ project, prev, next }: ProjectCaseProps) {
  const locale = useLocale()
  const t = useTranslations("ProjectsSection")
  const [openAt, setOpenAt] = useState<number | null>(null)

  const title = pick(project.title, locale)
  const description = pick(project.description, locale)

  // 空欄（まだ書いていない項目）は行ごと出さない。
  const cs = project.caseStudy
  const caseRows: [string, string][] = (
    [
      [t("case_problem"), pick(cs.problem, locale)],
      [t("case_role"), pick(cs.role, locale)],
      [t("case_decision"), pick(cs.decisions, locale)],
      [t("case_result"), pick(cs.result, locale)],
    ] as [string, string][]
  ).filter(([, v]) => v.trim().length > 0)

  const items: LightboxItem[] = project.shots.map((shot) => ({
    src: shot.image.url,
    caption: pick(shot.caption, locale),
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
          {project.shots.slice(0, LEAD_SHOTS).map((shot, i) => {
            const caption = items[i].caption
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpenAt(i)}
                  aria-label={`${t("open_viewer")}：${caption}`}
                  className={cn(
                    "group block w-full cursor-zoom-in text-left",
                    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9882a]",
                  )}
                >
                  <ShotLabel n={i + 1} caption={caption} />

                  <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_10px_40px_-28px_rgba(0,0,0,0.6)] transition group-hover:border-[#e9882a]/60 dark:border-white/10 dark:bg-white/5">
                    <Image
                      src={shot.image.url}
                      alt={caption}
                      width={shot.image.width}
                      height={shot.image.height}
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      quality={80}
                      {...blurProps(shot.image)}
                      className="h-auto w-full"
                    />
                  </div>
                </button>
              </li>
            )
          })}
        </ol>

        {/* 残りは 2 列に縮めて並べる。図版は小さくしても、番号と説明は付けたまま
            にする（説明が 02 で切れると、以降の画面が何なのか読めなくなる）。 */}
        {items.length > LEAD_SHOTS && (
          <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2">
            {project.shots.slice(LEAD_SHOTS).map((shot, i) => {
              const index = i + LEAD_SHOTS
              const item = items[index]
              // 縦横比は画面ごとにばらばら（横長のログ画面から縦長のスマホまで）。
              // 元の比をそのまま使い、極端なものだけ枠を詰めて余白を抑える。
              const ratio = Math.min(Math.max(shot.image.width / shot.image.height, 0.8), 2.2)
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => setOpenAt(index)}
                    aria-label={`${t("open_viewer")}：${item.caption}`}
                    className={cn(
                      "group block w-full cursor-zoom-in text-left",
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9882a]",
                    )}
                  >
                    <ShotLabel n={index + 1} caption={item.caption} />

                    <div
                      className="relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_10px_40px_-28px_rgba(0,0,0,0.6)] transition group-hover:border-[#e9882a]/60 dark:border-white/10 dark:bg-white/5"
                      style={{ aspectRatio: ratio }}
                    >
                      <Image
                        src={shot.image.url}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 640px) 100vw, 480px"
                        quality={75}
                        className="object-contain"
                      />
                    </div>
                  </button>
                </li>
              )
            })}
          </ol>
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
                {pick(prev.title, locale)}
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
                {pick(next.title, locale)}
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
