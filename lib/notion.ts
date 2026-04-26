import { NotionAPI } from "notion-client";
import { Block, ExtendedRecordMap } from "notion-types";
import { getPageContentBlockIds, getPageTitle } from "notion-utils";

import { Blog } from "@/types/blog";

const notion = new NotionAPI();
const NOTION_BLOCK_CHUNK_SIZE = 100;
const RECORD_MAP_KEYS = ["block", "collection", "collection_view", "notion_user"] as const;

type RecordMapKey = (typeof RECORD_MAP_KEYS)[number];
type RecordMapEntry = { role?: string; value?: unknown };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapRecordValue(entry: RecordMapEntry): RecordMapEntry {
  const value = entry.value;

  if (!isObject(value) || !("value" in value)) {
    return entry;
  }

  const innerValue = value.value;
  if (!isObject(innerValue) || !("id" in innerValue)) {
    return entry;
  }

  return {
    role: typeof value.role === "string" ? value.role : entry.role,
    value: innerValue,
  };
}

function normalizeRecordMap<T>(recordMap: T): T {
  const maps = recordMap as Record<RecordMapKey, Record<string, RecordMapEntry> | undefined>;

  for (const key of RECORD_MAP_KEYS) {
    const map = maps[key];
    if (!map) continue;

    for (const id of Object.keys(map)) {
      map[id] = unwrapRecordValue(map[id]);
    }
  }

  return recordMap;
}

function getBlockFromEntry(entry: unknown): Block | undefined {
  const block = unwrapRecordValue(entry as RecordMapEntry).value;

  if (!isObject(block) || !("type" in block)) {
    return undefined;
  }

  return block as unknown as Block;
}

function toHyphenatedId(id: string): string {
  if (id.length !== 32) return id;

  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

function chunkIds(ids: string[]): string[][] {
  return ids.reduce<string[][]>((chunks, id, index) => {
    if (index % NOTION_BLOCK_CHUNK_SIZE === 0) {
      chunks.push([]);
    }

    chunks[chunks.length - 1].push(id);
    return chunks;
  }, []);
}

async function fetchMissingBlocks(recordMap: ExtendedRecordMap): Promise<void> {
  while (true) {
    const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
      (id) => !recordMap.block[id]
    );

    if (pendingBlockIds.length === 0) {
      return;
    }

    const blockChunks = await Promise.all(
      chunkIds(pendingBlockIds).map(async (ids) => {
        const chunk = await notion.getBlocks(ids);
        return normalizeRecordMap(chunk.recordMap).block ?? {};
      })
    );

    Object.assign(recordMap.block, ...blockChunks);
  }
}

async function getCompletePageRecordMap(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = normalizeRecordMap(
    await notion.getPage(pageId, {
      fetchMissingBlocks: false,
      fetchCollections: false,
      signFileUrls: false,
    })
  );

  await fetchMissingBlocks(recordMap);
  await notion.addSignedUrls({ recordMap });

  return recordMap;
}

export async function getPageContent(pageId: string) {
  const recordMap = await getCompletePageRecordMap(pageId);

  return {
    title: getPageTitle(recordMap),
    blocks: recordMap.block,
    recordMap,
  };
}

export async function getAllBlogPosts(pageId: string) {
  const recordMap = normalizeRecordMap(await notion.getPage(pageId));
  const parentHyphenated = toHyphenatedId(pageId);

  const blogPosts = Object.entries(recordMap.block).flatMap<Blog>(([key, entry]) => {
    const block = getBlockFromEntry(entry);
    const title = block?.properties?.title?.[0]?.[0];

    if (!block || block.type !== "page" || !title) return [];
    if (key === parentHyphenated) return [];
    if (block.parent_id && block.parent_id !== parentHyphenated) return [];

    return [
      {
        id: key,
        block,
        pageCover: block.format?.page_cover || "",
        title,
        createdAt: new Date(block.created_time),
      },
    ];
  });

  return blogPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty");
  }

  if (url.startsWith("data:") || url.startsWith("https://images.unsplash.com")) {
    return url;
  }

  try {
    const u = new URL(url);
    const isSignedNotionS3Url =
      u.pathname.startsWith("/secure.notion-static.com") &&
      u.hostname.endsWith(".amazonaws.com") &&
      u.searchParams.has("X-Amz-Credential") &&
      u.searchParams.has("X-Amz-Signature") &&
      u.searchParams.has("X-Amz-Algorithm");

    if (isSignedNotionS3Url) {
      url = u.origin + u.pathname;
    }
  } catch {
    // Invalid URLs are handled by the Notion image proxy below.
  }

  const imagePath = url.startsWith("/images")
    ? `https://www.notion.so${url}`
    : url;
  const notionImageUrl = new URL(
    `https://www.notion.so${
      imagePath.startsWith("/image") ? imagePath : `/image/${encodeURIComponent(imagePath)}`
    }`
  );

  let table = block.parent_table === "space" ? "block" : block.parent_table;
  if (table === "collection" || table === "team") {
    table = "block";
  }

  notionImageUrl.searchParams.set("table", table);
  notionImageUrl.searchParams.set("id", block.id);
  notionImageUrl.searchParams.set("cache", "v2");

  return notionImageUrl.toString();
};

export const mapPageUrl = (pageId: string, locale: string = "en"): string => {
  return `/${locale}/blog/${pageId}`;
};
