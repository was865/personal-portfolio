import { customMapImageUrl, getAllBlogPosts } from "@/lib/notion";
import { notionBlogConfig } from "@/config/site";
import BlogUI from "@/components/blog/BlogUI";

export const revalidate = 0;

const Page = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const blogPosts = await getAllBlogPosts(notionBlogConfig.blogParentId);

  return <BlogUI blogPosts={blogPosts} locale={locale} />;
};

export default Page;
