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
    <html lang={locale} className="scroll-smooth!">
      <body
        className={`${fontUbuntu.className} pt-10 md:pt-16 h-screen bg-[#f6f2f2] relative dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
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
