import { NotionPage } from "@/components/NotionPage";
import { getPageContent } from "@/lib/notion";

type Props = {
  params: Promise<{ locale: string, blogId: string }>
}

export default async function Page({ params }: Props) {
  const { locale, blogId } = await params;
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
