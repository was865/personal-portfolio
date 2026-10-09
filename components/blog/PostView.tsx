import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import BackLink from "@/components/BackLink";
import { NotionBlocks } from "@/components/notion/NotionBlocks";
import { fontSourceCodePro } from "@/config/fonts";
import type { BlockNode, TocEntry } from "@/lib/notion/blocks";
import type { Post } from "@/lib/notion/posts";
import type { ContentLang } from "@/lib/utils";

type SiblingLink = { id: string; title: string } | null;

const LANG_LABEL: Record<ContentLang, string> = { ja: "日本語", zh: "中文", en: "English" };

function fontClass(lang: ContentLang) {
  return lang === "ja" ? "font-ja" : lang === "zh" ? "font-zh" : "";
}

function formatDate(iso: string, locale: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : locale === "zh" ? "zh-CN" : "ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function PostView({
  post,
  blocks,
  locale,
  posts,
  toc,
  readingMinutes,
  prev,
  next,
  translations,
}: {
  post: Post;
  blocks: BlockNode[];
  locale: string;
  /** 本文中のリンクを記事 URL に解決するため。キーは正規化した ID。 */
  posts: Map<string, string>;
  toc: TocEntry[];
  readingMinutes: number;
  prev: SiblingLink;
  next: SiblingLink;
  translations: { id: string; title: string; lang: ContentLang }[];
}) {
  // locale を明示すると next-intl がヘッダを読まず、ページを ISR のままにできる。
  const t = await getTranslations({ locale, namespace: "Blog" });

  // 記事の表記言語。UI のロケールで決めると、日本語UIで中文記事を開いたときに
  // 簡体字だけが OS のフォールバックに落ちて字形が混ざる。
  const contentLang = post.lang;
  const formattedDate = formatDate(post.publishedAt, locale);
  // 見出しが少ない記事に目次は要らない。
  const showToc = toc.length >= 3;

  return (
    <div lang={contentLang} className={`min-h-screen ${fontClass(contentLang)}`}>
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <BackLink href={`/${locale}/blog`}>{t("back_to_list")}</BackLink>

        <header className="mt-6 border-b border-black/10 pb-8 dark:border-white/10">
          {post.tags.length > 0 && (
            <ul className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-black/[0.06] px-2 py-0.5 text-[11px] text-gray-600 dark:bg-white/10 dark:text-white/60"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <h1 className="max-w-3xl text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>

          <div
            className={`${fontSourceCodePro.className} mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.12em] text-gray-500 dark:text-white/45`}
          >
            {formattedDate && <time dateTime={post.publishedAt}>{formattedDate}</time>}
            <span aria-hidden>·</span>
            <span>{t("reading_time", { minutes: readingMinutes })}</span>
            <span aria-hidden>·</span>
            <span className="rounded-full bg-black/[0.06] px-2 py-0.5 dark:bg-white/10">
              {LANG_LABEL[contentLang]}
            </span>
          </div>

          {/* 同じ記事の他言語版。Notion の Translations 列から引く。 */}
          {translations.length > 0 && (
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-gray-600 dark:text-white/60">
              <span>{t("translations")}:</span>
              {translations.map((tr) => (
                <Link
                  key={tr.id}
                  href={`/${locale}/blog/${tr.id.replace(/-/g, "")}`}
                  lang={tr.lang}
                  hrefLang={tr.lang}
                  className="rounded-full border border-black/10 px-2.5 py-0.5 transition hover:border-[#e9882a] hover:text-[#e9882a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:border-white/15 dark:hover:text-yellow"
                >
                  {LANG_LABEL[tr.lang]}
                </Link>
              ))}
            </p>
          )}
        </header>

        <div className={showToc ? "gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem]" : ""}>
          <article className="post-body min-w-0 pt-10">
            <NotionBlocks blocks={blocks} ctx={{ locale, posts }} />
          </article>

          {showToc && (
            <aside className="hidden pt-10 lg:block">
              {/* 見出しが多い記事だと画面外まで伸びるので、目次自体をスクロールさせる。 */}
              <nav
                className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1"
                aria-label={t("toc")}
              >
                <p
                  className={`${fontSourceCodePro.className} mb-3 text-[11px] tracking-[0.18em] text-gray-500 dark:text-white/45`}
                >
                  {t("toc").toUpperCase()}
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
                href={`/${locale}/blog/${prev.id.replace(/-/g, "")}`}
                className="group rounded-xl border border-black/10 p-4 transition hover:border-[#e9882a]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:border-white/10"
              >
                <span
                  className={`${fontSourceCodePro.className} flex items-center gap-1 text-[10px] tracking-[0.14em] text-gray-500 dark:text-white/45`}
                >
                  <HiChevronLeft className="h-3.5 w-3.5" /> PREV
                </span>
                <span className="mt-1.5 block text-sm text-gray-800 transition group-hover:text-[#e9882a] dark:text-white/80 dark:group-hover:text-yellow">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next && (
              <Link
                href={`/${locale}/blog/${next.id.replace(/-/g, "")}`}
                className="group rounded-xl border border-black/10 p-4 text-right transition hover:border-[#e9882a]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a] dark:border-white/10"
              >
                <span
                  className={`${fontSourceCodePro.className} flex items-center justify-end gap-1 text-[10px] tracking-[0.14em] text-gray-500 dark:text-white/45`}
                >
                  NEXT <HiChevronRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1.5 block text-sm text-gray-800 transition group-hover:text-[#e9882a] dark:text-white/80 dark:group-hover:text-yellow">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
