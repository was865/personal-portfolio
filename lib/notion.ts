import { NotionAPI } from "notion-client";
import { Block } from "notion-types";
import { getPageTitle } from "notion-utils";

import { Blog } from "@/types/blog";
import { notionBlogConfig } from "@/config/site";

const notion = new NotionAPI();

export async function getPageContent(pageId: string) {
  const recordMap = await notion.getPage(pageId);
  const title = getPageTitle(recordMap);
  const blocks = recordMap.block;

  return { title, blocks, recordMap };
}

export async function getAllBlogPosts(pageId: string) {
  const recordMap = await notion.getPage(pageId);
  console.log(recordMap);
  const blocks = recordMap.block;

  let blogPosts: Blog[] = [];

  Object.entries(blocks).forEach(([key, value]) => {
    // ブログの親ページIDと異なり、かつページタイプのブロックのみを処理
    if (key !== notionBlogConfig.blogParentId && value.value?.type === 'page') {
      const title = value.value.properties?.title?.[0]?.[0];
      // タイトルが存在する場合のみブログ記事として追加
      if (title) {
        blogPosts.push({
          id: key,
          block: value.value,
          pageCover: value.value.format?.page_cover || '',
          title: title,
          createdAt: new Date(value.value.created_time),
        });
      }
    }
  });
  console.log('blogPosts', blogPosts);

  // 作成日時で降順にソート
  return blogPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty");
  }

  if (url.startsWith("data:")) {
    return url;
  } // more recent versions of notion don't proxy unsplash images

  if (url.startsWith("https://images.unsplash.com")) {
    return url;
  }

  try {
    const u = new URL(url);

    if (
      u.pathname.startsWith("/secure.notion-static.com") &&
      u.hostname.endsWith(".amazonaws.com")
    ) {
      if (
        u.searchParams.has("X-Amz-Credential") &&
        u.searchParams.has("X-Amz-Signature") &&
        u.searchParams.has("X-Amz-Algorithm")
      ) {
        // if the URL is already signed, then use it as-is
        url = u.origin + u.pathname;
      }
    }
  } catch {
    // ignore invalid urls
  }

  if (url.startsWith("/images")) {
    url = `https://www.notion.so${url}`;
  }

  url = `https://www.notion.so${
    url.startsWith("/image") ? url : `/image/${encodeURIComponent(url)}`
  }`;

  const notionImageUrlV2 = new URL(url);
  let table = block.parent_table === "space" ? "block" : block.parent_table;

  if (table === "collection" || table === "team") {
    table = "block";
  }
  notionImageUrlV2.searchParams.set("table", table);
  notionImageUrlV2.searchParams.set("id", block.id);
  notionImageUrlV2.searchParams.set("cache", "v2");

  url = notionImageUrlV2.toString();

  return url;
};

export const mapPageUrl = (pageId: string, locale: string = 'en'): string => {
  return `/${locale}/blog/${pageId}`;
};
