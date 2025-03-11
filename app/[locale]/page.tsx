import Intro from "@/components/Intro"
import SectionDivider from "@/components/SectionDivider"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Skills from "@/components/Skills"
import Experience from "@/components/Experience"
import { isMobileDevice } from "@/lib/utils"
import Header from "@/components/Header"
// import Contact from "@/components/Contact"

export const metadata = {
  title: "Ansen | Personal Portfolio",
  description: "Ansen is a developer who enjoys exploring full stack development and AI innovation.",
}

export default async function Home() {
  const isMobile = await isMobileDevice()

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center px-4 overflow-x-hidden">
        <Intro />
        <SectionDivider />
        <About />
        <Projects />
        <Skills />
        <Experience isMobile={isMobile} />
        {/* <Contact /> */}
      </main>
    </>
  )
}
