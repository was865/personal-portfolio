import { getPageContent, getAllBlogPosts, buildToc, estimateReadingMinutes } from '@/lib/notion';
import { notionBlogConfig } from '@/config/site';
import { NotionPage } from '@/components/NotionPage';
import { extractTags, getTitleWithoutTags } from '@/lib/utils';

// 記事本文は頻繁には変わらない。毎リクエスト Notion を叩く必要はない。
export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string, blogId: string }>
}

export default async function Page({ params }: Props) {
  const { locale, blogId } = await params;
  const { recordMap, title } = await getPageContent(blogId);

  // タイトルからタグを抽出
  const tags = extractTags(title);
  const cleanTitle = getTitleWithoutTags(title);

  // 前後の記事は一覧と同じ並び（作成日の新しい順）から取る。
  let siblings: { prev: { id: string; title: string } | null; next: { id: string; title: string } | null } = {
    prev: null,
    next: null,
  };

  if (notionBlogConfig.blogParentId) {
    try {
      const posts = await getAllBlogPosts(notionBlogConfig.blogParentId);
      const index = posts.findIndex((p) => p.id.replace(/-/g, '') === blogId.replace(/-/g, ''));
      if (index !== -1) {
        const toLink = (i: number) =>
          posts[i] ? { id: posts[i].id, title: getTitleWithoutTags(posts[i].title) } : null;
        // 一覧は新しい順なので、画面上の「前の記事」は配列の次の要素。
        siblings = { prev: toLink(index + 1), next: toLink(index - 1) };
      }
    } catch {
      // 前後リンクは無くても記事は読める。取得に失敗しても本文の表示は続ける。
    }
  }

  return (
    <NotionPage
      recordMap={recordMap}
      rootPageId={blogId}
      title={cleanTitle}
      tags={tags}
      locale={locale}
      toc={buildToc(recordMap, blogId)}
      readingMinutes={estimateReadingMinutes(recordMap)}
      prev={siblings.prev}
      next={siblings.next}
    />
  );
}
