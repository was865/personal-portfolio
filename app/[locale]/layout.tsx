import { use } from "react";
import Header from "@/components/Header"
import ThemeContextProvider from "@/context/theme-context"
import { ActionSectionContextProvider } from "@/context/action-section-context"
import Footer from "@/components/Footer"
import ThemeSwitch from "@/components/ThemeTwich"
// import { usePathname } from "next/navigation"
import LanguageSwitch from "@/components/LanguageSwitch"
import { NextIntlClientProvider, useMessages } from "next-intl"
import { MotionConfig } from "motion/react"
import WidgetWrapper from "@/components/WidgetWrapper"
import { 
  fontOleoScript, 
  fontInter, 
  fontUbuntu, 
  fontNotoSansJP, 
  fontNotoSansSC, 
} from "@/config/fonts";

export const metadata = {
  title: 'Ansen Wang - Portfolio',
  description: "Ansen Wang's portfolio site",
  manifest: '/manifest.json',
  applicationName: 'Ansen Portfolio',
  icons: {
    icon: '/favicon.ico',
    apple: '/profile-512x512.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ansen Portfolio',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export default function LocaleLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
  }
) {
  const params = use(props.params);

  const {
    locale
  } = params;

  const {
    children
  } = props;

  const messages = useMessages()

  // 日本語フォントと中国語フォントは常に両方読み込む。
  // 記事の言語は UI の言語と一致しないことがあり（日本語UIに中文記事が並ぶ）、
  // 片方しか無いと簡体字だけが OS のフォールバックで描かれて字形が混ざる。
  const fontVariables = `${fontNotoSansJP.variable} ${fontNotoSansSC.variable}`;

  // const pathname = usePathname()
  // const isProjectDetail = pathname.includes("projects")
  // フォント変数は html に置く。body に置くと :root のセレクタから参照できず、
  // globals.css の --font-family-sans が無効になり Ubuntu にフォールバックする。
  return (
    <html
      lang={locale}
      // ルート遷移時は Next.js 側でスムーズスクロールを一時的に切る。
      data-scroll-behavior="smooth"
      className={`${fontUbuntu.variable} ${fontOleoScript.variable} ${fontInter.variable} ${fontVariables} scroll-smooth! relative`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#f6f2f2] text-gray-950 relative dark:bg-[#0b0f11] dark:text-gray-50 dark:text-opacity-90"
      >
        {/* 背景の淡い光は body の background-image（app/globals.css）にある。
            以前はここに blur を掛けた div を 2 枚置いていたが、iPad Safari で
            合成レイヤの下に潜ると描かれず、四角い抜けになっていた。 */}

        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionConfig reducedMotion="user">
          <ThemeContextProvider>
            <ActionSectionContextProvider>
              <div className="safe-top">
                {children}
              </div>
              <Footer />
              <WidgetWrapper>
                <ThemeSwitch />
                <LanguageSwitch />
              </WidgetWrapper>
            </ActionSectionContextProvider>
          </ThemeContextProvider>
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
