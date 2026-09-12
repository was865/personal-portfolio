"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { fontSourceCodePro } from "@/config/fonts"
import { cn } from "@/lib/utils"
import { pick, type Project as ProjectItem } from "@/lib/cms/schema"

type ProjectProps = {
  project: ProjectItem
}

/** コンタクトシートに出す枚数。残りは最後のコマに「+N」として畳む。 */
const SHEET_SIZE = 4

export default function Project({ project }: ProjectProps) {
  const { slug, tags, shots } = project
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["0 1", "1.33 1"] })
  // 拡大の演出は残す。半透明は外す（読む前からカードが褪せて見えていた）。
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])
  const locale = useLocale()
  const t = useTranslations("ProjectsSection")

  const localizedTitle = pick(project.title, locale)
  const localizedDesc = pick(project.description, locale)
  const sheet = shots.slice(0, SHEET_SIZE)
  const overflow = shots.length - sheet.length

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { scale }}
      className="group mb-4 w-full max-w-[52rem] sm:mb-8 last:mb-0"
    >
      <Link
        href={`/${locale}/projects/${slug}`}
        prefetch={true}
        className={cn(
          "block rounded-2xl border border-black/5 bg-[#e8eaea] p-5 transition sm:p-8",
          "hover:border-black/10 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9882a]",
          "dark:border-white/10 dark:bg-white/10 dark:hover:border-white/20",
        )}
      >
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
          {/* 左：見出し・説明・タグ */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-semibold leading-snug text-gray-900 transition group-hover:text-[#e9882a] dark:text-white dark:group-hover:text-yellow sm:text-2xl">
              {localizedTitle}
            </h3>

            <p className="mt-3 leading-relaxed text-gray-700 dark:text-white/70">
              {localizedDesc}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white dark:bg-black/40 dark:text-white/70"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <span
              className={cn(
                fontSourceCodePro.className,
                "mt-auto pt-5 text-[11px] tracking-[0.14em] text-gray-500 transition",
                "group-hover:text-[#e9882a] dark:text-white/50 dark:group-hover:text-yellow",
              )}
            >
              {t("view_case", { count: shots.length })} →
            </span>
          </div>

          {/* 右：コンタクトシート（証拠の一覧） */}
          <ul className="grid grid-cols-2 items-start gap-2 sm:self-center">
            {sheet.map((shot, i) => {
              const isLast = i === sheet.length - 1 && overflow > 0
              return (
                <li key={i} className="relative overflow-hidden rounded-lg bg-black/5 dark:bg-black/30">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={shot.image.thumbUrl ?? shot.image.url}
                      alt={pick(shot.caption, locale)}
                      fill
                      sizes="(max-width: 640px) 45vw, 260px"
                      quality={70}
                      className="object-cover object-left-top transition duration-300 group-hover:scale-[1.03]"
                    />
                    {isLast && (
                      <span
                        className={cn(
                          fontSourceCodePro.className,
                          "absolute inset-0 flex items-center justify-center bg-black/65 text-sm tracking-[0.1em] text-white",
                        )}
                      >
                        +{overflow}
                      </span>
                    )}
                    {!isLast && (
                      <span
                        className={cn(
                          fontSourceCodePro.className,
                          "absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] tabular-nums tracking-[0.1em] text-white/90",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Link>
    </motion.div>
  )
}
