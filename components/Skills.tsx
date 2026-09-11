"use client"

import React from "react"
import { skillsDataWithIcons, skillGroups } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { motion } from "motion/react"
import SectionHeading from "./SectionHeading"
import { useLocale, useTranslations } from "next-intl"
import useSound from "use-sound";
import { fontSourceCodePro } from "@/config/fonts"

// 透明から始めると JS が動くまで消えているので、位置だけ動かす。
const fadeInAnimationVariants = {
  initial: {
    y: 24,
  },
  animate: (index: number) => ({
    y: 0,
    transition: {
      delay: 0.04 * index,
    },
  }),
}

const byId = new Map(skillsDataWithIcons.map((s) => [s.id, s]))

export default function Skills() {
  const { ref } = useSectionInView("Skills")
  const activeLocale = useLocale()
  const sectionLan = useTranslations("SectionName")
  const groupLan = useTranslations("SkillsSection")
  const [playPop] = useSound("/sounds/bubble.wav", { volume: 0.2 });

  return (
    <section
      id="skills"
      ref={ref}
      className="max-w-[53rem] scroll-mt-28 text-center mb-28 px-4"
    >
      <SectionHeading>
        {sectionLan("skills")}
      </SectionHeading>

      {/* 平らに24個並べても「何ができる人か」は伝わらない。
          4つに分け、いちばん上のグループだけ濃くする。
          ホバーの揺れ・音・吹き出しはそのまま。 */}
      <div className="mx-auto flex max-w-[46rem] flex-col text-left">
        {skillGroups.map((group, gi) => (
          <div
            key={group.key}
            className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-black/10 py-5 sm:grid-cols-[7.5rem_1fr] dark:border-white/10"
          >
            <h3
              className={`${fontSourceCodePro.className} m-0 pt-2 text-[11px] font-normal tracking-[0.14em] text-gray-500 dark:text-white/45`}
            >
              {groupLan(group.key)}
            </h3>

            <ul className="flex flex-wrap gap-2.5 text-[0.95rem] text-gray-800">
              {group.ids.map((id, i) => {
                const skill = byId.get(id)
                if (!skill) return null
                return (
                  <motion.li
                    key={id}
                    className={`group relative bg-white borderBlack rounded-xl px-4 py-2.5 dark:bg-white/10 dark:text-white/80 cursor-pointer ${
                      gi === 0 ? "" : "opacity-80"
                    }`}
                    variants={fadeInAnimationVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    custom={i}
                    whileHover={{
                      scale: 1.1,
                      rotate: [-1, 1, -1, 0],
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => {
                      playPop();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {skill.icon}
                      <span>{skill.name}</span>
                    </div>

                    <motion.div
                      className="absolute hidden group-hover:block bg-gray-900 text-white text-sm rounded-md py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 min-w-max z-10"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeLocale === "zh" ? skill.desc.zh : activeLocale === "ja" ? skill.desc.ja : skill.desc.en}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </motion.div>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
