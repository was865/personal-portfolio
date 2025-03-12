"use client"

import React from "react"
import { skillsDataWithIcons } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { motion } from "motion/react"
import SectionHeading from "./SectionHeading"
import { useLocale, useTranslations } from "next-intl"
import useSound from "use-sound";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
}

export default function Skills() {
  const { ref } = useSectionInView("Skills")
  const activeLocale = useLocale()
  const sectionLan = useTranslations("SectionName")
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
      <ul className="flex flex-wrap justify-center gap-3 text-lg text-gray-800">
        {skillsDataWithIcons.map((skill, index) => (
          <motion.li
            className="group relative bg-white borderBlack rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80 cursor-pointer"
            key={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
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
              className="absolute hidden group-hover:block bg-gray-900 text-white text-sm rounded-md py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 min-w-max"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeLocale === "zh" ? skill.desc.zh : activeLocale === "ja" ? skill.desc.ja : skill.desc.en}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
