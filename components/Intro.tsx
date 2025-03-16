"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { HiDownload } from "react-icons/hi"
import { FaGithubSquare, FaEnvelope } from "react-icons/fa"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { useSectionInView } from "@/lib/hooks"
import { TypeAnimation } from "react-type-animation"
import useSound from "use-sound"
import ClickSpark from "@/components/reactbits/ClickSpark"
import { fontSourceCodePro } from "@/config/fonts"
import DecryptedText from "@/components/reactbits/DecryptedText"

export default function Intro() {
  const { ref } = useSectionInView("Home")
  const activeLocale = useLocale()
  const t = useTranslations("IntroSection")
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
              console.log("sound")
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
      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium leading-[1.5]! sm:text-4xl flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className={`${fontSourceCodePro.className} text-sm tracking-wider `}>
          {t("hello_im")}
        </span>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <DecryptedText
            text={t("name")}
            parentClassName="text-center text-4xl font-bold tracking-tight sm:text-5xl block"
            useOriginalCharsOnly={true}
            speed={80}
          />

          <div className="text-center">
            <span
              className={`${fontSourceCodePro.className} text-sm tracking-wider`}
            >
              {t("im_a")}
            </span>
            <h2
              id="name"
              className=" text-center text-2xl sm:text-5xl lg:text-4xl lg:leading-normal font-extrabold"
            >
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
            </h2>
          </div>
        </motion.div>
        <p>{t("short_intro")}</p>
        <div className="flex items-center justify-center gap-1">
          <p>
            {t("focus_is")}
          </p>
          <DecryptedText
            text={t("innovation_ai")}
            className="italic font-bold"
            revealDirection="center"
            // useOriginalCharsOnly={true}
          />
        </div>
      </motion.h1>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center  gap-3 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
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
          className="bg-white py-2 px-3 text-sm text-gray-700 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href={
            `${activeLocale}/404.pdf`
          }
        >
          {t("download_cv")}
          <HiDownload />
        </Link>
        <Link
          className="bg-white p-3 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
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
          className="bg-white p-3 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
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
          className=" bg-white py-2 px-3 text-sm text-gray-700 flex items-center gap-2  rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href={`/${activeLocale}/blog`}
          prefetch={true}
        >
          {t("blog")}
        </Link>
      </motion.div>
    </section>
  )
}
