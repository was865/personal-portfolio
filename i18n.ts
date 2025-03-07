import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'zh'];

export default getRequestConfig(async ({ requestLocale }) => {
    // Await the requestLocale
    const locale = await requestLocale || locales[0];
    
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});