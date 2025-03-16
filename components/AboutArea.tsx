"use client";

import { Responsive } from "react-grid-layout";
import { useState } from "react";

// import { AnimationSwitch } from "./animation-swith";
// import MiniPic from "./mini-pic";

import { cn } from "@/lib/utils";
import AvatarTransition from "@/components/Avatar";
import { DockDemo } from "@/components/DockDemo";
// import { ThemeSwitch } from "@/components/theme-switch";
import CardStack from "@/components/CardStack";
// import AnimatedEmoji from "@/components/animated-emoji";
import IconCloud from "@/components/IconCloud";
// import MapComponent from "@/components/map";
// import WebAgent from "@/components/WebAgent";
// import Chatbot from "@/components/chatbot";
// import { MiniModel } from "@/components/mini";
// import Actions from "@/components/actions";
import { OpenBadge } from "@/components/OpenBadge";
import { layouts, selectedCard } from "@/config/layout";
import { icons } from "@/config/icons";
import useWindowWidth from "@/hooks/use-window-width";
import Paper from "@/components/Paper";
import SectionHeading from "@/components/SectionHeading";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import DecryptedText from "@/components/reactbits/DecryptedText";

interface HomeProps {
  photos: string[];
  avatarUrl: string;
  dogUrl: string;
  actionImageUrl: string;
  resumeUrl: string;
  webagentUrl: string;
  chatbotUrl: string;
  paperUrl: string;
  openBadgeUrl: string;
}

const AboutArea = ({
  photos,
  avatarUrl,
  dogUrl,
  actionImageUrl,
  resumeUrl,
  webagentUrl,
  chatbotUrl,
  paperUrl,
  openBadgeUrl
}: HomeProps) => {
  const width = useWindowWidth();
  const [tabSelected, setTabSelected] = useState("all");
  const [animated, setAnimated] = useState(false);
  const sectionLan = useTranslations("SectionName");
  const aboutLan = useTranslations("AboutSection");
  const { ref } = useSectionInView("About");

  if (!width) {
    return null;
  }

  // 画面幅に基づいて最大幅を計算
  const maxWidth = Math.min(width, 1200);

  return (
    <motion.section
      ref={ref}
      className="mb-50 text-start leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>{sectionLan("about")}</SectionHeading>

      <div className="flex justify-center flex-col items-center w-full">
        <div style={{ width: maxWidth, maxWidth: '100%' }}>
          <Responsive
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            className="layout w-full h-full"
            cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 }}
            isDraggable={width > 480}
            isResizable={false}
            layouts={layouts[tabSelected]}
            margin={[15, 15]}
            width={maxWidth}
            containerPadding={[15, 15]}
            rowHeight={width < 768 ? 120 : 150}
            compactType="vertical"
          >
            <div
              key="avatar"
              className={cn(
                "bg-white/90 dark:bg-[#0f1217] border-2 border-transparent dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex flex-col justify-between p-5 overflow-hidden z-[1] dark:text-white",
                selectedCard[tabSelected]["avatar"] ? "opacity-100" : "opacity-50"
              )}
            >
              <AvatarTransition avatarUrl={avatarUrl} dogUrl={dogUrl} />
                <p>
                  <span>
                    {aboutLan("intro_start")}
                  </span>
                  <DecryptedText
                    text={aboutLan("intro_name")}
                    parentClassName="text-2xl inline"
                    useOriginalCharsOnly={true}
                    speed={80}
                  />
                  <span>
                    {aboutLan("intro_end")}
                  </span>
                </p>
              <DockDemo resumeUrl={resumeUrl} />
            </div>
            {/* <div
              key="themeSwitch"
              className={cn(
                "bg-white dark:bg-[#0f1217] border-2 border-transparent dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center z-[1]",
                selectedCard[tabSelected]["themeSwitch"]
                  ? "opacity-100"
                  : "opacity-50"
              )}
            >
              <ThemeSwitch />
            </div> */}
            <div
              key="cardStack"
              className={cn(
                "bg-white dark:bg-[#0f1217] border-2 border-transparent dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center z-[2] overflow-hidden",
                selectedCard[tabSelected]["cardStack"]
                  ? "opacity-100"
                  : "opacity-50"
              )}
            >
              <CardStack photos={photos} />
            </div>
            <div
              key="paper"
              className={cn(
                "bg-white dark:bg-[#0f1217] dark:border-2 dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center z-[1] overflow-hidden dark:text-white",
                selectedCard[tabSelected]["paper"] ? "opacity-100" : "opacity-50"
              )}
            >
              <Paper paperUrl={paperUrl} />
            </div>
            <div
              key="openBadge"
              className={cn(
                "bg-white dark:bg-[#0f1217] dark:border-2 dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center z-[1] overflow-hidden",
                selectedCard[tabSelected]["openBadge"] ? "opacity-100" : "opacity-50"
              )}
            >
              <OpenBadge badgeUrl={openBadgeUrl} />
            </div>
            {/* <div
              key="animatedEmoji"
              className={cn(
                "bg-white dark:bg-[#0f1217] border-2 border-transparent dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center z-[1]",
                selectedCard[tabSelected]["animatedEmoji"]
                  ? "opacity-100"
                  : "opacity-50"
              )}
            >
              <AnimatedEmoji />
            </div> */}
            {/* <div
              key="mapComponent"
              className={cn(
                "bg-white dark:bg-[#0f1217] cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center z-[1]",
                selectedCard[tabSelected]["mapComponent"]
                  ? "opacity-100"
                  : "opacity-50"
              )}
            >
              <MapComponent />
            </div> */}
            <div
              key="iconCloud"
              className={cn(
                "bg-white dark:bg-[#0f1217] border-2 border-transparent dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center relative overflow-hidden p-10 md:p-8 z-[1]",
                selectedCard[tabSelected]["iconCloud"]
                  ? "opacity-100"
                  : "opacity-50"
              )}
            >
              <IconCloud iconSlugs={icons} />
            </div>
            {/* <div
              key="webAgent"
              className={cn(
                "bg-white dark:bg-[#0f1217] dark:border-2 dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center overflow-hidden z-[1]",
                selectedCard[tabSelected]["webAgent"] ? "opacity-100" : "opacity-50"
              )}
            >
              <WebAgent webAgentUrl={webagentUrl} />
            </div> */}
            {/* <div
              key="chatBot"
              className={cn(
                "bg-white dark:bg-[#0f1217] dark:border-2 dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center overflow-hidden z-[1]",
                selectedCard[tabSelected]["chatBot"] ? "opacity-100" : "opacity-50"
              )}
            >
              <Chatbot chatbotUrl={chatbotUrl} />
            </div> */}
            {/* <div
              key="miniModel"
              className={cn(
                "bg-white dark:bg-[#0f1217] border-2 border-transparent dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center z-[1] overflow-hidden",
                selectedCard[tabSelected]["miniModel"]
                  ? "opacity-100"
                  : "opacity-50"
              )}
            >
              {animated ? <MiniModel /> : <MiniPic />}
              <AnimationSwitch
                animated={animated}
                className="absolute top-4 right-4 z-50"
                setAnimated={setAnimated}
              />
            </div> */}
            {/* <div
              key="actions"
              className={cn(
                "bg-white dark:bg-[#0f1217] dark:border-2 dark:border-gray-700 cursor-grab active:cursor-grabbing rounded-[2rem] flex justify-center items-center overflow-hidden z-[1]",
                selectedCard[tabSelected]["actions"] ? "opacity-100" : "opacity-50"
              )}
            >
              <Actions photoUrl={actionImageUrl} />
            </div> */}
          </Responsive>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutArea;