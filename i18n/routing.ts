import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'zh', 'ja'];
export const defaultLocale = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // 可选：如果需要本地化路径名（如/about-us => /关于我们）
  // pathnames: {
  //   '/': '/',
  //   '/about': {
  //     en: '/about',
  //     zh: '/关于',
  //     ja: '/プロフィール'
  //   },
  // }
}); 