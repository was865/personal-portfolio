"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { FaGithubSquare, FaEnvelope } from "react-icons/fa"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { useSectionInView } from "@/lib/hooks"
import { projectsData } from "@/lib/data"
import { TypeAnimation } from "react-type-animation"
import useSound from "use-sound"
import ClickSpark from "@/components/reactbits/ClickSpark"
import { fontSourceCodePro } from "@/config/fonts"

import DecryptedText from "@/components/reactbits/DecryptedText"
import { siteConfig } from "@/config/site"
import { MdVerified } from "react-icons/md"
import { GoArrowUpRight } from "react-icons/go"

/**
 * ヒーローの操作ボタン。高さを 44px で揃え、指で押せる大きさを確保する。
 * 色は base に混ぜない。bg-white と bg-[#e9882a] を同じ文字列に並べても
 * どちらが勝つかは生成された CSS の順で決まり、白地に白文字になっていた。
 */
const PILL_BASE =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full" +
  " transition cursor-pointer focus:scale-[1.15] hover:scale-[1.15] active:scale-105"

const PILL =
  PILL_BASE +
  " bg-white text-gray-700 hover:text-gray-950 borderBlack dark:bg-white/10 dark:text-white/60"

/** ページ内で唯一の主ボタン。アクセント色はここだけに使う。 */
const PILL_PRIMARY =
  PILL_BASE + " bg-[#e9882a] text-white hover:text-white shadow-sm shadow-black/10"

export default function Intro() {
  const { ref } = useSectionInView("Home")
  const activeLocale = useLocale()
  const t = useTranslations("IntroSection")
  const badge = useTranslations("OpenBadge")
  const [playHover] = useSound("/sounds/bubble.wav", { volume: 0.2 })

  return (
    <section
      ref={ref}
      className="mb-10 max-w-[50rem] text-center sm:mb-0 scroll-mt-28 pt-[7rem]"
      id="home"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <ClickSpark
            sparkColor='#fff'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <Image
                src="/profile.png"
                alt="developer-image"
                width="250"
                height="250"
                quality="95"
                priority={true}
                className="h-28 w-28 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
              />
            </motion.div>
          </ClickSpark>
          <motion.span
            onHoverStart={() => {
              playHover()
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.25, rotate: 15 }}
            className="absolute text-4xl bottom-0 right-0 hover:rotate-2"
            transition={{
              type: "spring",
              duration: 0.7,
              delay: 0.1,
              stiffness: 125,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>
      <motion.div
        className="mb-10 mt-4 flex flex-col items-center justify-center px-4"
        // 静止状態＝読める状態にする。透明から始めると JS が動くまで消えている。
        initial={{ y: 24 }}
        animate={{ y: 0 }}
      >
        <span className={`${fontSourceCodePro.className} text-sm tracking-wider `}>
          {t("hello_im")}
        </span>
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="place-self-center text-center"
        >
          {/* このページで最大の文字は名前。以前は下の職種のほうが大きく、
              最初に目に入るのが冗談のほうだった。解密の演出はそのまま。 */}
          <h1 className="text-center text-5xl font-bold leading-[1.15] tracking-tight sm:text-7xl">
            <DecryptedText
              text={t("name")}
              parentClassName="block"
              useOriginalCharsOnly={true}
              speed={80}
            />
          </h1>

          {/* 肩書きと、くるくる変わる職種を同じ行に落とす。
              打字机はそのまま回す（性格として残す）が、主役ではなくなる。 */}
          <p className="mt-3 text-center text-base font-medium text-gray-700 sm:text-lg dark:text-white/75">
            {t("role")}
            <span className="mx-2 text-gray-400 dark:text-white/30">·</span>
            <span className={`${fontSourceCodePro.className} text-sm sm:text-base`}>
              <TypeAnimation
                sequence={[
                  "Genshin Impact Player",
                  1000,
                  "Full Stack Developer",
                  1000,
                  "Digital Nomad",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
          </p>

          {/* 取得資格。検証ページに飛べるようにしておく（見せるだけより強い）。
              職種の行に混ぜるとスマホで折り返すので、独立した行にする。 */}
          <Link
            href={siteConfig.links.openBadge}
            target="_blank"
            rel="noopener"
            className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] text-gray-500 underline-offset-4 transition hover:text-gray-800 hover:underline focus-visible:underline dark:text-white/45 dark:hover:text-white/80"
          >
            <MdVerified className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {badge("badgeTitle")}
            <GoArrowUpRight className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
          </Link>
        </motion.div>
        {/* 「探索が好き」「関心は Innovation (AI)」の2行は、上の肩書きと資格で
            すでに3回言っていることの繰り返しだった。いま何を作っているかの
            1行に置き換える。ここは本人しか書けない＝いちばん効く情報。
            解密の演出はホバー時だけにして、読む邪魔をしない。 */}
        <Link
          href={`/${activeLocale}/projects/${projectsData[0].slug}`}
          className="mt-5 text-center text-[15px] text-gray-600 underline-offset-4 transition hover:text-gray-900 hover:underline focus-visible:underline sm:text-base dark:text-white/65 dark:hover:text-white"
        >
          <DecryptedText
            text={t("now_building")}
            animateOn="hover"
            revealDirection="center"
            speed={45}
          />
        </Link>
      </motion.div>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-3 px-4 text-lg font-medium"
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        {/* <Link
          href="#contact"
          onClick={() => {
            setActiveSection("Contact")
            setTimeOfLastClick(Date.now())
          }}
          className="group bg-gray-900 px-4 py-2 text-sm sm:text-lg text-white sm:px-7 sm:py-3 flex items-center gap-2  rounded-full outline-hidden focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
        >
          Contact me here
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link> */}

        <Link
          className={`${PILL_PRIMARY} px-5 text-sm font-semibold`}
          href={`/${activeLocale}/projects/${projectsData[0].slug}`}
        >
          {t("view_projects")}
        </Link>
        <Link
          className={`${PILL} w-11 text-[1.35rem]`}
          href="https://github.com/was865"
          target="_blank"
        >
          <FaGithubSquare />
        </Link>
        {/* <a
          className="bg-white p-3 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://space.bilibili.com/"
          target="_blank"
        >
          <FaBilibili />
        </a> */}
        <Link
          className={`${PILL} w-11 text-[1.35rem]`}
          href="mailto:wangansen865@gmail.com"
          target="_blank"
        >
          <FaEnvelope />
        </Link>
        {/* <Link
          className="bg-white p-3 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="/部署教程指南.docx"
          download
        >
          <FaFileWord />
        </Link> */}
        <Link
          className={`${PILL} px-4 text-sm`}
          href={`/${activeLocale}/blog`}
          prefetch={true}
        >
          {t("blog")}
        </Link>
      </motion.div>
    </section>
  )
}
