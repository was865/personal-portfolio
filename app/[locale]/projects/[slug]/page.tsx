import { notFound } from "next/navigation"
import Header from "@/components/Header"
import ProjectCase from "@/components/ProjectCase"
import { locales } from "@/i18n/routing"
import { pick } from "@/lib/cms/schema"
import { getProjects } from "@/lib/cms/site"

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * ビルド時点のプロジェクトを事前生成する。CMS に後から増えた slug は
 * dynamicParams（既定 true）で要求時に描画され、`revalidateTag` で更新される。
 */
export async function generateStaticParams() {
  const projects = await getProjects()
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const project = (await getProjects()).find((item) => item.slug === slug)
  if (!project) return {}

  const title = pick(project.title, locale)
  const description = pick(project.description, locale)

  return {
    title: `${title} — Ansen Wang`,
    description,
    openGraph: { title, description, images: project.shots.map((shot) => shot.image.url).slice(0, 1) },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const projects = await getProjects()
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const toLink = (target: (typeof projects)[number]) => ({
    slug: target.slug,
    title: target.title,
  })

  return (
    <>
      <Header />
      <main className="flex flex-col items-center overflow-x-hidden">
        <ProjectCase
          project={project}
          prev={index > 0 ? toLink(projects[index - 1]) : null}
          next={index < projects.length - 1 ? toLink(projects[index + 1]) : null}
        />
      </main>
    </>
  )
}
