import createMiddleware from 'next-intl/middleware';

const proxy = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'zh', 'ja'],

    // Used when no locale matches
    defaultLocale: 'en'
});

export default proxy;

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(zh|en|ja)/:path*']
};
