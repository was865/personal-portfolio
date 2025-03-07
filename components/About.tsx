"use client"

import React from "react"
import { motion } from "motion/react"
import SectionHeading from "./SectionHeading"
import { useSectionInView } from "@/lib/hooks"
import { useLocale, useTranslations } from "next-intl"

export default function About() {
  const { ref } = useSectionInView("About")
  const t = useTranslations("AboutSection")
  const sectionLan = useTranslations("SectionName")

  return (
    <motion.section
      ref={ref}
      className="mb-50 max-w-[45rem] text-start leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>{sectionLan("about")}</SectionHeading>
      
      <div className="flex flex-col gap-3">
        <p>{t("desc")}</p>
        <p>{t("para1")}</p>
        <p>{t("para2")}</p>
        <p>{t("para3")}</p>
        <p>{t("para4")}</p>
      </div>
    </motion.section>
  )
}
