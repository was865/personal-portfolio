import { use } from "react";
import ThemeContextProvider from "@/context/theme-context"
import Footer from "@/components/Footer"
import ThemeSwitch from "@/components/ThemeTwich"
import { NextIntlClientProvider, useMessages } from "next-intl"
import WidgetWrapper from "@/components/WidgetWrapper"
import { fontUbuntu } from "@/config/fonts";

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
  return (
    <html lang={locale} className="scroll-smooth! relative">
      <body
        className={`${fontUbuntu.className} bg-gray-50 text-gray-950 relative dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        <div className="bg-[#ffe99b] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#5b3b3c]"></div>
        <div className="bg-[#b9f1fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#433f68]"></div>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeContextProvider>
              {children}
              <Footer />
              <WidgetWrapper>
                <ThemeSwitch />
              </WidgetWrapper>
          </ThemeContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
