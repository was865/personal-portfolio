import Intro from "@/components/Intro"
import SectionDivider from "@/components/SectionDivider"
import Projects from "@/components/Projects"
import Skills from "@/components/Skills"
import Experience from "@/components/Experience"
import { isMobileDevice, getRandomPhotos } from "@/lib/utils-server"
import Header from "@/components/Header"
import AboutArea from "@/components/AboutArea"

export default async function Home() {
  const isMobile = await isMobileDevice()
  // public/images/photosディレクトリからランダムに10枚の写真を取得
  const photos = getRandomPhotos(10)

  // AboutAreaコンポーネントに必要なprops
  const aboutAreaProps = {
    photos: photos,
    avatarUrl: "/images/avatar.jpg",
    dogUrl: "/images/dog.jpg",
    actionImageUrl: "/images/action.jpg",
    resumeUrl: "#",
    webagentUrl: "/images/webagent.jpg",
    chatbotUrl: "/images/chatbot.jpg",
    paperUrl: "/images/paper.jpg",
    openBadgeUrl: "https://www.openbadge-global.com/api/v1.0/openBadge/v2/Wallet/Public/GetAssertionShare/SU02RC9nakE3Y3dNeWVOMTMxUEhnZz09",
  }

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center overflow-x-hidden">
        <Intro />
        <SectionDivider />
        {/* <About /> */}
        <AboutArea {...aboutAreaProps} />
        <Projects />
        <Skills />
        <Experience isMobile={isMobile}/>
        {/* <Contact /> */}
      </main>
    </>
  )
}
