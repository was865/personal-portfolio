import { use } from "react";
import Header from "@/components/Header"
import ThemeContextProvider from "@/context/theme-context"
import { ActionSectionContextProvider } from "@/context/action-section-context"
import Footer from "@/components/Footer"
import ThemeSwitch from "@/components/ThemeTwich"
// import { usePathname } from "next/navigation"
import LanguageSwitch from "@/components/LanguageSwitch"
import { NextIntlClientProvider, useMessages } from "next-intl"
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
      className={`${fontUbuntu.variable} ${fontOleoScript.variable} ${fontInter.variable} ${fontVariables} scroll-smooth! relative`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#f6f2f2] text-gray-950 relative dark:bg-[#0b0f11] dark:text-gray-50 dark:text-opacity-90"
      >
        <div className="bg-[#ffe99b] absolute top-[-3rem] sm:top-[-6rem] -z-10 right-0 sm:right-[11rem] h-[20rem] sm:h-[31.25rem] w-[100%] sm:w-[31.25rem] rounded-full blur-[5rem] sm:blur-[10rem] dark:bg-[#5b3b3c]"></div>
        <div className="bg-[#b9f1fb] absolute top-[-1rem] -z-10 left-[-10rem] sm:left-[-35rem] h-[20rem] sm:h-[31.25rem] w-[100%] sm:w-[50rem] rounded-full blur-[5rem] sm:blur-[10rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#433f68]"></div>

        <NextIntlClientProvider locale={locale} messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
