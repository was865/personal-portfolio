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

  // フォントをロケールに基づいて選択
  const getLocaleFont = () => {
    switch (locale) {
      case 'ja':
        return fontNotoSansJP.variable;
      case 'zh':
        return fontNotoSansSC.variable;
      default:
        return '';
    }
  };

  // const pathname = usePathname()
  // const isProjectDetail = pathname.includes("projects")
  return (
    <html lang={locale} className="scroll-smooth! relative">
      <body
        className={`${fontUbuntu.className} ${fontOleoScript.variable} ${fontInter.variable} ${getLocaleFont()} bg-[#f6f2f2] text-gray-950 relative dark:bg-[#0b0f11] dark:text-gray-50 dark:text-opacity-90`}
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
