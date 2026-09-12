"use client"

import React from "react"
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import SectionHeading from "./SectionHeading"
import { motion } from "motion/react"
import { useTheme } from "@/context/theme-context"
import { ExperienceLabel } from "./ExperienceLabel"
import { useLocale, useTranslations } from "next-intl"
import { resolveIcon } from "@/config/icon-registry"
import { pick, type Experience as ExperienceItem } from "@/lib/cms/schema"

type ExperienceProps = {
  isMobile: boolean
  /** CMS から order 昇順で渡ってくる経歴。 */
  items: ExperienceItem[]
}

export default function Experience({ isMobile, items }: ExperienceProps) {
  const { theme } = useTheme()
  const variants = {
    // 左右から滑り込む動きは残す。ただし透明からは始めない
    // （JS が動くまで経歴が全部消えている状態だった）。振り幅も抑える。
    left: {
      hidden: { x: -56 },
      visible: { x: 0, transition: { duration: 0.5 } },
    },
    right: {
      hidden: { x: 56 },
      visible: { x: 0, transition: { duration: 0.5 } },
    },
  }

  const activeLocale = useLocale()
  const t = useTranslations("SectionName")

  return (
    <section className="sm:mb-40 relative mb-20 px-4">
      <ExperienceLabel />
      <SectionHeading>
        {t("experiences")}
      </SectionHeading>
      {!isMobile ? (
        <VerticalTimeline lineColor={theme == "light" ? "#e9e9ea" : "#3b3d4f"}>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={variants[index % 2 === 0 ? "right" : "left"]}
              className="mb-20"
            >
              <VerticalTimelineElement
                position={index % 2 === 0 ? "left" : "right"}
                visible={true}
                contentStyle={{
                  background:
                    theme === "light" ? "#f3f4f6" : "rgba(255, 255, 255, 0.05)",
                  boxShadow: "none",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  textAlign: "left",
                  padding: "1.3rem 2rem",
                }}
                contentArrowStyle={{
                  borderRight:
                    theme === "light"
                      ? "0.4rem solid #9ca3af"
                      : "0.4rem solid rgba(255, 255, 255, 0.5)",
                }}
                date={pick(item.date, activeLocale)}
                icon={<>{resolveIcon(item.icon)}</>}
                iconStyle={{
                  background:
                    theme === "light" ? "white" : "rgba(255, 255, 255, 0.15)",
                  fontSize: "1.5rem",
                }}
              >
                <h3 className="font-bold capitalize">{pick(item.title, activeLocale)}</h3>
                <p className="font-normal mt-0!">{pick(item.location, activeLocale)}</p>
                <p className="mt-1! font-normal! text-gray-700 dark:text-white/75">
                  {pick(item.description, activeLocale)}
                </p>
              </VerticalTimelineElement>
            </motion.div>
          ))}
        </VerticalTimeline>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex dark:bg-slate-800 dark:text-slate-100 bg-slate-100 border-1 border-opacity-80 rounded-lg p-6 pb-8 flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 `}
            >
              <div className="w-10 h-5 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                {resolveIcon(item.icon)}
              </div>
              {pick(item.date, activeLocale)}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold capitalize">{pick(item.title, activeLocale)}</h3>
                <p className="font-normal mt-0!">{pick(item.location, activeLocale)}</p>
                <p className="mt-1! font-normal! text-gray-700 dark:text-white/75">
                  {pick(item.description, activeLocale)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
