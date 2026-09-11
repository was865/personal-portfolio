"use client"

import { motion } from "motion/react"
import { links } from "@/lib/data"
import Link from "next/link"
import clsx from "clsx"
import { useActiveSectionContext } from "@/context/action-section-context"
import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "next/navigation"

function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext()
  const t = useTranslations("Header")
  const locale = useLocale()
  const pathname = usePathname()
  // トップ以外（プロジェクト詳細やブログ）では、ハッシュだけではセクションに飛べない。
  const isHome = pathname === `/${locale}` || pathname === "/"
  const hrefFor = (hash: string) => (isHome ? hash : `/${locale}${hash}`)

  return (
    <header className="z-999 relative">
      <motion.div
        className="fixed top-[calc(env(safe-area-inset-top)+0)] left-1/2 -translate-x-1/2 h-[3.5rem] w-full rounded-none border border-white/50 bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.65rem] sm:top-[calc(env(safe-area-inset-top)+1.5rem)] sm:h-[3.25rem] sm:w-[30rem] sm:rounded-full dark:bg-gray-950/85 dark:border-black/40"
        initial={{ y: -16 }}
        animate={{ y: 0 }}
      ></motion.div>
      <nav className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+0)] flex h-[3.5rem] w-full max-w-[30rem] -translate-x-1/2 items-center px-2 sm:top-[calc(env(safe-area-inset-top)+1.7rem)] sm:h-[initial] sm:w-[initial] sm:px-0">
        <ul className="no-scrollbar flex w-full flex-nowrap items-center justify-start overflow-x-auto text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:justify-center sm:gap-5 sm:overflow-visible">
          {links.map((link) => (
            <motion.li
              key={link.hash}
              className="relative flex shrink-0 items-center justify-center break-keep"
              initial={{ y: -12 }}
              animate={{ y: 0 }}
            >
              <Link
                href={hrefFor(link.hash)}
                className={clsx(
                  "flex h-11 w-full items-center justify-center whitespace-nowrap px-3 transition hover:text-gray-950 dark:hover:text-gray-300",
                  {
                    "text-gray-950": activeSection === link.name,
                    "dark:hover:text-gray-600": activeSection == link.name,
                  }
                )}
                onClick={() => {
                  setActiveSection(link.name)
                  setTimeOfLastClick(Date.now())
                }}
              >
                {t(link.name.toLowerCase())}
                {link.name === activeSection && (
                  <motion.span
                    className="bg-gray-100 rounded-full absolute inset-0 -z-10"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  ></motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
