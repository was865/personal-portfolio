import { setRequestLocale } from "next-intl/server";

import BlogUI from "@/components/blog/BlogUI";
import { getPublishedPosts } from "@/lib/notion/posts";

// 一覧は ISR。Notion の Webhook（/api/revalidate）で更新時にすぐ作り直す。
// Webhook が無くても 1 分で新しい記事が出る。
export const revalidate = 60;

// ビルド時には生成せず、最初のアクセスで作ってキャッシュする（Notion が落ちていてもビルドは通る）。
export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ locale: string }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getPublishedPosts();
  return <BlogUI posts={posts} locale={locale} />;
};

export default Page;
