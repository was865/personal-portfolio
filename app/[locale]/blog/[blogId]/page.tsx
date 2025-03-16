import { NotionPage } from "@/components/NotionPage";
import { getPageContent } from "@/lib/notion";

type Props = {
  params: Promise<{ locale: string, blogId: string }>
}

// タイトルからタグを抽出する関数
const extractTags = (title: string) => {
  const tagMatch = title.match(/\[(.*?)\]$/);
  if (!tagMatch) return [];
  
  return tagMatch[1].split(',').map(tag => tag.trim());
}

// タグなしのタイトルを取得する関数
const getTitleWithoutTags = (title: string) => {
  return title.replace(/\[.*?\]$/, '').trim();
}

export default async function Page({ params }: Props) {
  const { locale, blogId } = await params;
  const { recordMap, title } = await getPageContent(blogId);

  // タイトルからタグを抽出
  const tags = title ? extractTags(title) : [];
  const cleanTitle = title ? getTitleWithoutTags(title) : '';

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
