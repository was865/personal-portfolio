import { getPageContent } from '@/lib/notion';
import { NotionPage } from '@/components/NotionPage';
import { extractTags, getTitleWithoutTags } from '@/lib/utils';

type Props = {
  params: Promise<{ locale: string, blogId: string }>
}

export default async function Page({ params }: Props) {
  const { locale, blogId } = await params;
  const { recordMap, title } = await getPageContent(blogId);

  // タイトルからタグを抽出
  const tags = extractTags(title);
  const cleanTitle = getTitleWithoutTags(title);

  return (
    <NotionPage
      recordMap={recordMap}
      rootPageId={blogId}
      title={cleanTitle}
      tags={tags}
      locale={locale}
    />
  );
}
