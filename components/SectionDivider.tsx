"use client"

import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { IoIosArrowDown } from "react-icons/io"

export default function SectionDivider() {
  const t = useTranslations("Header")
  const reduceMotion = useReducedMotion()

  return (
    // 押せる範囲はリンク自身に持たせる（44px）。外枠を動かすと、
    // 矢印が指の下から逃げて押せたり押せなかったりする。
    <div className="mb-20 mt-12 hidden sm:block">
      <Link
        href="#about"
        aria-label={t("about")}
        className={
          "group flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition " +
          "hover:text-[#e9882a] focus-visible:outline-2 focus-visible:outline-offset-2 " +
          "focus-visible:outline-[#e9882a] dark:text-white/45 dark:hover:text-[#e9882a]"
        }
      >
        <motion.span
          className="flex"
          initial={reduceMotion ? false : { scale: 0.7 }}
          animate={{ scale: 1 }}
        >
          <IoIosArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
        </motion.span>
      </Link>
    </div>
  )
}
