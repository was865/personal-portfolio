"use client"

import React from "react"
import { projectsData } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import SectionHeading from "./SectionHeading"
import Project from "./Project"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { FaAngleRight } from "react-icons/fa6"

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.1)
  const sectionT = useTranslations("SectionName")
  const projectsT = useTranslations("ProjectsSection")

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28 w-full flex flex-col items-center px-4">
      <SectionHeading>
        {sectionT("projects")}
      </SectionHeading>
      <div className="w-full flex flex-col items-center">
        {projectsData.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
      <Link
        className="group tracing-wide font-semibold hover:underline hover:underline-offset-4 hover:decoration-[#80bef9] text-slate-800 dark:text-slate-400 w-full flex gap-1 items-center justify-center mt-10"
        target="_blank"
        href="https://github.com/was865"
      >
        {projectsT("view_all")}
        <FaAngleRight className="group-hover:translate-x-2 transition" />
      </Link>
    </section>
  )
}
