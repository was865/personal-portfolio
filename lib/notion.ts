import { NotionAPI } from "notion-client";
import { Block } from "notion-types";
import { getPageTitle } from "notion-utils";

import { Blog } from "@/types/blog";

const notion = new NotionAPI();

// notion-client 7.1.6 は block を { value: { role, value: Block } } と二重ラップで返すため、
// react-notion-x が期待する { role, value: Block } 形式に平坦化する。
type RawEntry = { role?: string; value?: { role?: string; value?: unknown } & Record<string, unknown> };

function normalizeRecordMap<T>(recordMap: T): T {
  const rm = recordMap as unknown as Record<string, Record<string, RawEntry>>;
  const maps = ['block', 'collection', 'collection_view', 'notion_user'] as const;
  for (const key of maps) {
    const map = rm?.[key];
    if (!map) continue;
    for (const id of Object.keys(map)) {
      const entry = map[id];
      const inner = entry?.value;
      if (inner && inner.value && typeof inner.value === 'object' && 'id' in (inner.value as Record<string, unknown>)) {
        map[id] = {
          role: inner.role ?? entry.role,
          value: inner.value as RawEntry['value'],
        };
      }
    }
  }
  return recordMap;
}

export async function getPageContent(pageId: string) {
  const recordMap = normalizeRecordMap(await notion.getPage(pageId));
  const title = getPageTitle(recordMap);
  const blocks = recordMap.block;

  return { title, blocks, recordMap };
}

export async function getAllBlogPosts(pageId: string) {
  const recordMap = await notion.getPage(pageId);
  const blocks = recordMap.block;

  // 環境変数の親ID（ハイフンなし32文字）を、ブロックキーで使われるハイフン付きUUIDに正規化する。
  const parentHyphenated =
    pageId.length === 32
      ? `${pageId.slice(0, 8)}-${pageId.slice(8, 12)}-${pageId.slice(12, 16)}-${pageId.slice(16, 20)}-${pageId.slice(20)}`
      : pageId;

  const blogPosts: Blog[] = [];

  Object.entries(blocks).forEach(([key, entry]) => {
    // notion-clientはブロックを { value: { value: Block } } でラップする。古い形式の { value: Block } にもフォールバック対応。
    const block: any = (entry as any)?.value?.value ?? (entry as any)?.value;
    if (!block || block.type !== 'page') return;
    if (key === parentHyphenated) return;
    if (block.parent_id && block.parent_id !== parentHyphenated) return;

    const title = block.properties?.title?.[0]?.[0];
    if (!title) return;

    blogPosts.push({
      id: key,
      block,
      pageCover: block.format?.page_cover || '',
      title,
      createdAt: new Date(block.created_time),
    });
  });

  console.log(blogPosts)

  // 作成日時で降順にソート
  return blogPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty");
  }

  if (url.startsWith("data:")) {
    return url;
  } // 最近のNotionではunsplashの画像をプロキシしなくなった

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
        // URLがすでに署名済みの場合は、そのまま使用する
        url = u.origin + u.pathname;
      }
    }
  } catch {
    // 不正なURLは無視する
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
