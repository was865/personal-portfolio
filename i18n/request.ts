import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Await the requestLocale
    const locale = await requestLocale || defaultLocale;
    
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
}); 