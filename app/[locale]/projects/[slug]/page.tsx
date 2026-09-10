import { notFound } from "next/navigation"
import Header from "@/components/Header"
import ProjectCase from "@/components/ProjectCase"
import { projectsData } from "@/lib/data"
import { locales } from "@/i18n/routing"

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projectsData.map((project) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const project = projectsData.find((p) => p.slug === slug)
  if (!project) return {}

  const title = locale === "zh" ? project.title_zh : locale === "ja" ? project.title_ja : project.title
  const description =
    locale === "zh" ? project.desc_zh : locale === "ja" ? project.desc_ja : project.description

  return {
    title: `${title} — Ansen Wang`,
    description,
    openGraph: { title, description, images: [project.shots[0].src.src] },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const index = projectsData.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = projectsData[index]
  const toLink = (p: (typeof projectsData)[number]) => ({
    slug: p.slug,
    title: p.title,
    title_ja: p.title_ja,
    title_zh: p.title_zh,
  })

  return (
    <>
      <Header />
      <main className="flex flex-col items-center overflow-x-hidden">
        <ProjectCase
          project={project}
          prev={index > 0 ? toLink(projectsData[index - 1]) : null}
          next={index < projectsData.length - 1 ? toLink(projectsData[index + 1]) : null}
        />
      </main>
    </>
  )
}
