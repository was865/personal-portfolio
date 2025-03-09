import { NotionPage } from "@/components/notion-page";
import { getPageContent } from "@/lib/notion";

export const revalidate = 0;

export default async function Page({ params }: { params: { locale: string, blogId: string } }) {
  const { locale, blogId } = params;
  const { recordMap, title } = await getPageContent(blogId);

  return (
    <NotionPage
      recordMap={recordMap}
      rootPageId={blogId}
      title={title ?? undefined}
      locale={locale}
    />
  );
}
