"use client"

import { IoLanguageOutline } from "react-icons/io5"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useSound } from 'use-sound';



export default function LanguageSwitch() {
  const localActive = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  
const [playEnToZhSound] = useSound('zh.mp3');
const [playZhToEnSound] = useSound('en.mp3');
  const onChangeLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextLocale = localActive === "en" ? "zh" : "en"
    const newPath = pathname.replace(/^\/(en|zh)/, `/${nextLocale}/`)

    if (localActive === "en") {
      playEnToZhSound(); // 播放从英文切换到中文的音效
    } else {
      playZhToEnSound(); // 播放从中文切换到英文的音效
    }
    router.replace(newPath, {
      scroll: false,
    })
  }

  return (
    <>
      <button
        onClick={onChangeLanguage}
        className="w-[2.5rem] h-[2.5rem] bg-opacity-80 flex items-center justify-center gap-1 transition-all "
      >
        <span className="sr-only">Change Language</span>
        {/* <IoLanguageOutline /> */}

        <span className="text-sm hover:scale-[1.15] active:scale-105 transition-all">
          {" "}
          {localActive == "en" ? "EN" : "中"}
        </span>
      </button>
    </>
  )
}
