import Intro from "@/components/Intro"
import SectionDivider from "@/components/SectionDivider"
import Projects from "@/components/Projects"
import Skills from "@/components/Skills"
import Experience from "@/components/Experience"
import { isMobileDevice } from "@/lib/utils-server"
import Header from "@/components/Header"
import AboutArea from "@/components/AboutArea"
import { siteConfig } from "@/config/site"
import { getExperiences, getPhotos, getProjects, getSkills, shuffle } from "@/lib/cms/site"

export default async function Home() {
  const [isMobile, projects, experiences, skills, allPhotos] = await Promise.all([
    isMobileDevice(),
    getProjects(),
    getExperiences(),
    getSkills(),
    getPhotos(),
  ])

  // 写真はリクエストごとに顔ぶれを変える（キャッシュの外で選ぶ）
  const photos = shuffle(allPhotos, 10).map((photo) => photo.image.url)

  const aboutAreaProps = {
    photos,
    avatarUrl: "/images/avatar.jpg",
    dogUrl: "/images/dog.jpg",
    actionImageUrl: "/images/action.jpg",
    resumeUrl: "#",
    webagentUrl: "/images/webagent.jpg",
    chatbotUrl: "/images/chatbot.jpg",
    paperUrl: "/images/paper.jpg",
    openBadgeUrl: siteConfig.links.openBadge,
  }

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center overflow-x-hidden">
        <Intro featuredProjectSlug={projects[0]?.slug ?? ""} />
        <SectionDivider />
        <AboutArea {...aboutAreaProps} />
        <Projects projects={projects} />
        <Skills groups={skills.groups} items={skills.items} />
        <Experience isMobile={isMobile} items={experiences} />
      </main>
    </>
  )
}
