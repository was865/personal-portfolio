import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PostView } from "@/components/blog/PostView";
import { normalizeId } from "@/lib/notion/client";
import {
  buildToc,
  estimateReadingMinutes,
  firstParagraph,
  getPageBlocks,
} from "@/lib/notion/blocks";
import { getPublishedPost, getPublishedPosts } from "@/lib/notion/posts";

// 本文は ISR でキャッシュする。Notion の Webhook（/api/revalidate）が
// 設定されていれば更新時にすぐ作り直され、無くても 5 分で入れ替わる。
export const revalidate = 300;

// ビルド時には生成せず、最初のアクセスで作ってキャッシュする。
export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ locale: string; blogId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogId } = await params;
  const post = await getPublishedPost(blogId);
  if (!post) return {};

  const description = post.summary || firstParagraph(await getPageBlocks(post.id));
  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.publishedAt,
      tags: post.tags,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale, blogId } = await params;
  setRequestLocale(locale);

  const [post, posts] = await Promise.all([getPublishedPost(blogId), getPublishedPosts()]);
  if (!post) notFound();

  const blocks = await getPageBlocks(post.id);

  // 前後の記事は同じ言語の中で辿る。翻訳版が交互に並ぶと同じ話が続くため。
  const sameLang = posts.filter((p) => p.lang === post.lang);
  const index = sameLang.findIndex((p) => p.id === post.id);
  const toLink = (i: number) => (sameLang[i] ? { id: sameLang[i].id, title: sameLang[i].title } : null);

  const translations = post.translationIds
    .map((id) => posts.find((p) => normalizeId(p.id) === normalizeId(id)))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .map((p) => ({ id: p.id, title: p.title, lang: p.lang }));

  return (
    <PostView
      post={post}
      blocks={blocks}
      locale={locale}
      posts={new Map(posts.map((p) => [normalizeId(p.id), p.title]))}
      toc={buildToc(blocks)}
      readingMinutes={estimateReadingMinutes(blocks)}
      // 一覧は新しい順なので、画面上の「前の記事」は配列の次の要素。
      prev={toLink(index + 1)}
      next={toLink(index - 1)}
      translations={translations}
    />
  );
}
