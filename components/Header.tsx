"use client"

import { motion } from "motion/react"
import { links } from "@/lib/data"
import Link from "next/link"
import clsx from "clsx"
import { useActiveSectionContext } from "@/context/action-section-context"
import { useTranslations } from "next-intl"

function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext()
  const t = useTranslations("Header")
  
  return (
    <header className="z-999 relative">
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 h-[4.5rem] w-full rounded-none border border-white/40 bg-white/40 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] sm:w-[30rem] sm:rounded-full dark:bg-gray-950/75 dark:border-black/40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      ></motion.div>
      <nav className="flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:flex-nowrap sm:gap-5">
          {links.map((link, index) => (
            <motion.li
              key={link.hash}
              className="h-3/4 flex items-center justify-center relative break-keep"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href={link.hash}
                className={clsx(
                  "flex w-full items-center justify-center px-3 py-3 whitespace-nowrap hover:text-gray-950 dark:hover:text-gray-300 transition",
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
