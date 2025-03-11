import { customMapImageUrl, getAllBlogPosts } from "@/lib/notion";
import { notionBlogConfig } from "@/config/site";
import BlogUI from "@/components/blog/BlogUI";

export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>
}

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  const blogPosts = await getAllBlogPosts(notionBlogConfig.blogParentId);

  return <BlogUI blogPosts={blogPosts} locale={locale} />;
};

export default Page;
