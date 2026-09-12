import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './routing';
import { deepMerge } from '@/lib/cms/deep-merge';
import type { Locale } from '@/lib/cms/schema';
import { readCollection } from '@/lib/cms/store';

export default getRequestConfig(async ({ requestLocale }) => {
    // Await the requestLocale
    const locale = await requestLocale || defaultLocale;
    
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale)) notFound();

    // messages/*.json が既定値。CMS（content/about.json）の部分木だけを上に重ねる。
    // UI ラベルは git 管理のまま、自己紹介などの本文は管理画面から書き換えられる。
    const base = (await import(`../messages/${locale}.json`)).default;
    const about = await readCollection('about');

    return {
        locale,
        messages: deepMerge(base, about.messages?.[locale as Locale] ?? {})
    };
}); 