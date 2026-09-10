"use client";

import { useTheme } from "next-themes";
import { ExtendedRecordMap } from "notion-types";
import { useMemo } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { NotionRenderer, NotionComponents } from "react-notion-x";
import dynamic from "next/dynamic";
import Link from "next/link";
import { mapPageUrl, type TocEntry } from '@/lib/notion';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { fontSourceCodePro } from "@/config/fonts";
import { detectContentLang } from '@/lib/utils';
import { useTranslations } from "next-intl"
const prismComponents = [
  "prism-markup-templating",
  "prism-markup",
  "prism-bash",
  "prism-c",
  "prism-cpp",
  "prism-csharp",
  "prism-docker",
  "prism-java",
  "prism-js-templates",
  "prism-coffeescript",
  "prism-diff",
  "prism-git",
  "prism-go",
  "prism-graphql",
  "prism-handlebars",
  "prism-less",
  "prism-makefile",
  "prism-markdown",
  "prism-objectivec",
  "prism-ocaml",
  "prism-python",
  "prism-reason",
  "prism-rust",
  "prism-sass",
  "prism-scss",
  "prism-solidity",
  "prism-sql",
  "prism-stylus",
  "prism-swift",
  "prism-wasm",
  "prism-yaml",
];

const Code = dynamic(
  () =>
    import("react-notion-x/build/third-party/code").then(async (m) => {
      const importPromises = prismComponents.map(
        (component) => import(`prismjs/components/${component}.js`)
      );

      await Promise.allSettled(importPromises);

      return m.Code;
    }),
  {
    ssr: false,
  }
);

const Collection = dynamic(
  () =>
    import("react-notion-x/build/third-party/collection").then(
      (m) => m.Collection
    ),
  {
    ssr: false,
  }
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

type SiblingLink = { id: string; title: string } | null;

export const NotionPage = ({
  recordMap,
  rootPageId,
  title,
  tags = [],
  locale,
  toc = [],
  readingMinutes,
  prev = null,
  next = null,
}: {
  recordMap: ExtendedRecordMap;
  rootPageId: string;
  title?: string;
  tags?: string[];
  locale: string;
  toc?: TocEntry[];
  readingMinutes?: number;
  prev?: SiblingLink;
  next?: SiblingLink;
}) => {
  const isClient = useIsClient();
  const { theme } = useTheme();
  const t = useTranslations('Blog')
  const components: Partial<NotionComponents> = useMemo(
    () => ({
      Code,
      Collection,
      Equation,
      Pdf,
      Modal
    }),
    []
  );

  // 記事の表記言語。UI のロケールで決めると、日本語UIで中文記事を開いたときに
  // 簡体字だけが OS のフォールバックに落ちて字形が混ざる。
  const contentLang = detectContentLang(title);

  const getContentFontClass = () => {
    switch (contentLang) {
      case 'ja':
        return 'font-ja';
      case 'zh':
        return 'font-zh';
      default:
        return '';
    }
  };

  if (!isClient) {
    return null;
  }

  if (!recordMap) {
    return null;
  }

  const rootEntry = recordMap.block[rootPageId];
  const rootBlock = rootEntry?.value;
  const createdTime = rootBlock?.created_time;
  const createdDate = createdTime ? new Date(createdTime) : null;

  const formattedDate = createdDate && !isNaN(createdDate.getTime())
    ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : locale === 'zh' ? 'zh-CN' : 'ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(createdDate)
    : '';

  const langLabel = contentLang === 'ja' ? '日本語' : contentLang === 'zh' ? '中文' : 'English';
  // 見出しが少ない記事に目次は要らない。
  const showToc = toc.length >= 3;

  return (
    <div lang={contentLang} className={`min-h-screen ${getContentFontClass()}`}>
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <Link
          href={`/${locale}/blog`}
          prefetch={true}
          className={`${fontSourceCodePro.className} inline-flex w-fit items-center gap-1 text-[11px] tracking-[0.14em] text-gray-500 transition hover:text-[#e9882a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:text-white/50 dark:hover:text-yellow`}
        >
          <HiChevronLeft className="h-4 w-4" />
          {t('back')}
        </Link>

        <header className="mt-6 border-b border-black/10 pb-8 dark:border-white/10">
          {tags.length > 0 && (
            <ul className="mb-4 flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <li
                  key={index}
                  className="rounded-md bg-black/[0.06] px-2 py-0.5 text-[11px] text-gray-600 dark:bg-white/10 dark:text-white/60"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <h1 className="max-w-3xl text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h1>

          <div
            className={`${fontSourceCodePro.className} mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.12em] text-gray-500 dark:text-white/45`}
          >
            {formattedDate && <span>{formattedDate}</span>}
            {readingMinutes ? (
              <>
                <span aria-hidden>·</span>
                <span>{t('reading_time', { minutes: readingMinutes })}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span className="rounded-full bg-black/[0.06] px-2 py-0.5 dark:bg-white/10">
              {langLabel}
            </span>
          </div>
        </header>

        <div className={showToc ? 'gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem]' : ''}>
          {/* 本文。日本語で1行が長くなりすぎないよう横幅を絞る。 */}
          <article className="notion-article min-w-0 pt-10">
            <NotionRenderer
              components={components}
              darkMode={theme === "dark"}
              fullPage={false}
              recordMap={recordMap}
              rootPageId={rootPageId}
              className={`notion-container ${getContentFontClass()}`}
              mapPageUrl={(pageId) => mapPageUrl(pageId, locale)}
            />
          </article>

          {showToc && (
            <aside className="hidden pt-10 lg:block">
              {/* 見出しが多い記事だと画面外まで伸びるので、目次自体をスクロールさせる。 */}
              <nav
                className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1"
                aria-label={t('toc')}
              >
                <p
                  className={`${fontSourceCodePro.className} mb-3 text-[11px] tracking-[0.18em] text-gray-500 dark:text-white/45`}
                >
                  {t('toc').toUpperCase()}
                </p>
                <ul className="space-y-1.5 border-l border-black/10 dark:border-white/10">
                  {toc.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className="-ml-px block border-l border-transparent py-0.5 text-[13px] leading-snug text-gray-600 transition hover:border-[#e9882a] hover:text-[#e9882a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:text-white/55 dark:hover:text-yellow"
                        style={{ paddingLeft: `${entry.level * 0.75}rem` }}
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>

        {(prev || next) && (
          <nav className="mt-16 grid gap-3 border-t border-black/10 pt-8 sm:grid-cols-2 dark:border-white/10">
            {prev ? (
              <Link
                href={`/${locale}/blog/${prev.id}`}
                className="group rounded-xl border border-black/10 p-4 transition hover:border-[#e9882a]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:border-white/10"
              >
                <span
                  className={`${fontSourceCodePro.className} flex items-center gap-1 text-[10px] tracking-[0.14em] text-gray-500 dark:text-white/45`}
                >
                  <HiChevronLeft className="h-3.5 w-3.5" /> PREV
                </span>
                <span
                  lang={detectContentLang(prev.title)}
                  className="mt-1.5 block text-sm text-gray-800 transition group-hover:text-[#e9882a] dark:text-white/80 dark:group-hover:text-yellow"
                >
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next && (
              <Link
                href={`/${locale}/blog/${next.id}`}
                className="group rounded-xl border border-black/10 p-4 text-right transition hover:border-[#e9882a]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:border-white/10"
              >
                <span
                  className={`${fontSourceCodePro.className} flex items-center justify-end gap-1 text-[10px] tracking-[0.14em] text-gray-500 dark:text-white/45`}
                >
                  NEXT <HiChevronRight className="h-3.5 w-3.5" />
                </span>
                <span
                  lang={detectContentLang(next.title)}
                  className="mt-1.5 block text-sm text-gray-800 transition group-hover:text-[#e9882a] dark:text-white/80 dark:group-hover:text-yellow"
                >
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
};
