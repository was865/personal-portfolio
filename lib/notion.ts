import { NotionAPI } from "notion-client";
import { Block, ExtendedRecordMap } from "notion-types";
import { getPageContentBlockIds, getPageTitle } from "notion-utils";

import { Blog } from "@/types/blog";

// Notion rejects requests sent with Node's default `User-Agent: node` (403).
// notion-client goes through ky -> global fetch, so the UA has to be set here.
const NOTION_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const notion = new NotionAPI({
  kyOptions: { headers: { "user-agent": NOTION_USER_AGENT } },
});
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

  if (url.startsWith("data:")) {
    return url;
  }

  // Notion 組み込みカバー（/images/page-cover/...）は公開の静的ファイル。
  // これをプロキシに通すと二重に包まれて 302 になり、画像が出なくなる。
  if (url.startsWith("/images/")) {
    return `https://www.notion.so${url}`;
  }

  let parsed: URL | null = null;
  try {
    const candidate = new URL(url);
    // attachment:xxx は例外を投げずスキームとして解釈されてしまう。
    // http(s) 以外は素通しせず、下のプロキシに解決させる。
    if (candidate.protocol === "http:" || candidate.protocol === "https:") {
      parsed = candidate;
    }
  } catch {
    // 相対パスなど。下のプロキシで解決する。
  }

  if (parsed) {
    // 既にプロキシ形式ならそのまま使う。
    if (parsed.hostname === "www.notion.so" && parsed.pathname.startsWith("/image")) {
      return url;
    }

    // Notion が保管しているファイルだけがプロキシ（再署名）を必要とする。
    // 外部の公開URL（Unsplash / imgur など）は直接読んだほうが確実で速い。
    const isNotionHosted =
      parsed.hostname.endsWith(".amazonaws.com") ||
      parsed.hostname.endsWith("notion-static.com") ||
      parsed.hostname.endsWith("notion.so");

    if (!isNotionHosted) {
      return url;
    }

    // 署名は失効するので、パスだけ残してプロキシ側に付け直させる。
    url = parsed.origin + parsed.pathname;
  }

  const notionImageUrl = new URL(
    `https://www.notion.so/image/${encodeURIComponent(url)}`
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
