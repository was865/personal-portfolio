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
      {/* 帯は画面の一番上から引く。iOS の PWA では時計やアンテナの下を本文が
          流れていくので、そこに背当てを置く。中身はセーフエリアぶん下げる。
          横幅の丸いバーになるのは sm から。 */}
      <motion.div
        className="fixed inset-x-0 top-0 mx-auto h-[calc(3.5rem+var(--safe-top))] w-full rounded-none border-0 border-b border-white/50 bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.65rem] sm:top-[calc(var(--safe-top)+1.5rem)] sm:h-[3.25rem] sm:w-[30rem] sm:rounded-full sm:border dark:border-black/40 dark:bg-gray-950/85"
        initial={{ y: -16 }}
        animate={{ y: 0 }}
      ></motion.div>
      {/* 横向きだと左右も切り欠きに掛かるので、余白はセーフエリアと大きい方を取る。
          中央寄せに translate を使わない。画面幅が奇数（iPhone は 393px）だと
          left:50% が 196.667px になり、それを打ち消す小数の translate が残る。
          iOS はこの層を一度描いてから小数ぶんずらすので、文字がぼやける。 */}
      <nav className="fixed inset-x-0 top-[var(--safe-top)] mx-auto flex h-[3.5rem] w-full max-w-[30rem] items-center pl-[max(0.5rem,var(--safe-left))] pr-[max(0.5rem,var(--safe-right))] sm:top-[calc(var(--safe-top)+1.7rem)] sm:h-[initial] sm:w-[initial] sm:px-0">
        {/* w-max + mx-auto なら、収まるときは中央、あふれるときは左端から
            スクロールできる。justify-center だけだと、あふれた分が左に隠れて
            「首页」に戻れなくなる。 */}
        <ul className="no-scrollbar mx-auto flex w-max max-w-full flex-nowrap items-center overflow-x-auto overscroll-x-contain text-[0.9rem] font-medium text-gray-500 sm:gap-5 sm:overflow-visible">
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
                  // 5項目が 375px の画面にも収まるよう、狭いうちは詰める。
                  "flex h-11 w-full items-center justify-center whitespace-nowrap px-2.5 transition hover:text-gray-950 sm:px-3 dark:hover:text-gray-300",
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
                    className="absolute inset-0 -z-10 rounded-full bg-gray-100 dark:bg-white/10"
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
