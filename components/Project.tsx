"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { projectsData } from "@/lib/data"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import Link from "next/link"
import { FiExternalLink } from "react-icons/fi"
import { FiX } from "react-icons/fi"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { useLocale } from "next-intl"

type ProjectProps = (typeof projectsData)[number]

export default function Project({
  title,
  description,
  title_zh,
  desc_zh,
  title_ja,
  desc_ja,
  tags,
  imageUrls,
  //projectUrl,
  demoUrl,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  })
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1])
  const activeLocale = useLocale()

  // ギャラリー関連の状態
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const gallery = useMemo(() => {
    return imageUrls && imageUrls.length > 0 ? imageUrls : []
  }, [imageUrls])

  const goNext = () => setCurrent((prev) => (prev + 1) % gallery.length)
  const goPrev = () => setCurrent((prev) => (prev - 1 + gallery.length) % gallery.length)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    document.addEventListener("keydown", onKey)
    // スクロールロック
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = original
    }
  }, [isOpen, gallery.length])

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
      className="group mb-3 sm:mb-8 last:mb-0 w-full max-w-[45rem] mx-auto"
    >
      <section className="bg-[#e8eaea] border border-black/5 rounded-lg overflow-hidden sm:pr-8 relative transition sm:group-even:pl-8 dark:text-white dark:bg-white/10 ">
        <div className="group pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col items-start gap-3 h-full sm:group-even:ml-[18rem]">
          <div className="flex flex-col gap-3 items-start ">
            <h3 className="text-2xl font-semibold group-hover:text-[#e9882a] dark:group-hover:text-yellow hover:underline">
              <Link href={demoUrl} target="_blank">
                {activeLocale === "zh" ? title_zh : activeLocale === "ja" ? title_ja : title}
              </Link>
            </h3>

            <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-300">
              {" "}
              {demoUrl && (
                <Link
                  href={demoUrl}
                  target="_blank"
                  className=" w-full flex items-center gap-1 hover:underline underline-offset-2"
                >
                  <span className="break-keep min-w-[4.5rem]">Demo Link</span>
                  <FiExternalLink className="w-5 h-5 " />
                </Link>
              )}
            </div>
          </div>

          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
            {activeLocale === "zh" ? desc_zh : activeLocale === "ja" ? desc_ja : description}
          </p>
          <ul className="flex flex-wrap mt-auto gap-2">
            {tags.map((tag, index) => (
              <li
                className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {gallery.length > 0 && (
          <Image
            src={gallery[0]}
            alt="Project I worked on"
            quality={70}
            onClick={() => setIsOpen(true)}
            className="absolute hidden sm:block top-8 -right-24 w-[28.25rem] rounded-t-lg shadow-2xl
            transition cursor-zoom-in
            group-hover:scale-[1.04]
            group-hover:-translate-x-3
            group-hover:translate-y-3
            group-hover:-rotate-2

            group-hover:group-even:translate-x-3
            group-hover:group-even:translate-y-3
            group-hover:group-even:rotate-2

            group-even:right-[initial] group-even:-left-32"
          />
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden"
            >
              <button
                aria-label="close"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
              >
                <FiX className="h-5 w-5" />
              </button>

              {/* メイン画像 */}
              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={gallery[current]}
                  alt="gallery"
                  fill
                  priority
                  className="object-contain"
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 hover:bg-black/80"
                      aria-label="previous image"
                    >
                      <HiChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white p-3 hover:bg-black/80"
                      aria-label="next image"
                    >
                      <HiChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* サムネイル */}
              {gallery.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-zinc-100 dark:bg-zinc-800">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`relative h-16 w-28 flex-shrink-0 rounded-md overflow-hidden ring-2 transition ${
                        current === idx ? "ring-[#e9882a]" : "ring-transparent hover:ring-white/40"
                      }`}
                    >
                      <Image src={img} alt={`thumb-${idx}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </section>
    </motion.div>
  )
}
