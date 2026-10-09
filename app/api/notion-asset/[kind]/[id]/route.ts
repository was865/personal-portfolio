import { isFullBlock, isFullPage, isNotionClientError } from "@notionhq/client";

import { blogDataSourceId, normalizeId, notion } from "@/lib/notion/client";
import { PROP } from "@/lib/notion/posts";

/**
 * Notion にアップロードされた画像・ファイルの中継。
 *
 * 公式 API が返すファイル URL は署名付きで 1 時間しか有効でない。ページに
 * そのまま埋めると、キャッシュされた HTML から 1 時間後に画像が消える。
 * そこで HTML にはこのルートの URL を書き、取りに来るたびに API で
 * 新しい署名 URL を引いて中身を返す。結果は CDN に 1 日キャッシュさせる。
 *
 *   /api/notion-asset/block/<blockId>  本文の image / file / pdf / video / audio
 *   /api/notion-asset/cover/<pageId>   記事のカバー画像
 */

const ID = /^[0-9a-f]{32}$/;
const MEDIA_TYPES = new Set(["image", "file", "pdf", "video", "audio"]);

type Params = { params: Promise<{ kind: string; id: string }> };

async function signedUrlForBlock(id: string): Promise<string | null> {
  const block = await notion().blocks.retrieve({ block_id: id });
  if (!isFullBlock(block) || !MEDIA_TYPES.has(block.type)) return null;

  const media = (block as unknown as Record<string, unknown>)[block.type] as
    | { type: "file"; file: { url: string } }
    | { type: "external"; external: { url: string } };
  return media.type === "file" ? media.file.url : media.external.url;
}

async function signedUrlForCover(id: string): Promise<string | null> {
  const page = await notion().pages.retrieve({ page_id: id });
  if (!isFullPage(page)) return null;

  // 記事データベースの、公開中の行のカバーだけを返す。
  const parent = page.parent;
  if (parent.type !== "data_source_id") return null;
  if (normalizeId(parent.data_source_id) !== normalizeId(blogDataSourceId())) return null;
  const status = page.properties[PROP.status];
  if (status?.type !== "select" || status.select?.name !== "Published") return null;

  const cover = page.cover;
  if (!cover) return null;
  return cover.type === "file" ? cover.file.url : cover.external.url;
}

export async function GET(_req: Request, { params }: Params) {
  const { kind, id: rawId } = await params;
  const id = normalizeId(rawId);
  if (!ID.test(id) || (kind !== "block" && kind !== "cover")) {
    return new Response("Not found", { status: 404 });
  }

  let url: string | null;
  try {
    url = kind === "block" ? await signedUrlForBlock(id) : await signedUrlForCover(id);
  } catch (error) {
    if (isNotionClientError(error)) return new Response("Not found", { status: 404 });
    throw error;
  }
  if (!url) return new Response("Not found", { status: 404 });

  const upstream = await fetch(url);
  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: 502 });
  }

  const headers = new Headers({
    // ブラウザには 1 時間、CDN には 1 日。差し替えた画像は最大 1 日遅れて反映される。
    "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  });
  for (const name of ["content-type", "content-length", "content-disposition"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(upstream.body, { status: 200, headers });
}
