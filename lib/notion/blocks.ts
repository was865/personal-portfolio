import "server-only";

import { cache } from "react";
import { isFullBlock } from "@notionhq/client";
import type { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client";

import { notion } from "./client";

/** 子ブロックを埋め込んだブロック。描画側はこれだけを見る。 */
export type BlockNode = BlockObjectResponse & { children: BlockNode[] };

/**
 * Notion API のレート制限は平均 3 リクエスト/秒。入れ子の多い記事で
 * 子ブロックを一斉に取りに行くと 429 が続くので、同時に投げる数を絞る。
 * （429 自体はクライアントが Retry-After を見て再試行する）
 */
const CONCURRENCY = 3;

function limiter(max: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  const next = () => {
    if (active >= max) return;
    const run = queue.shift();
    if (run) {
      active++;
      run();
    }
  };

  return <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      queue.push(() => {
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--;
            next();
          });
      });
      next();
    });
}

async function listChildren(
  blockId: string,
  limit: ReturnType<typeof limiter>,
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const res = await limit(() =>
      notion().blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 }),
    );
    for (const b of res.results) {
      if (isFullBlock(b)) blocks.push(b);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

/** 子ページや子データベースの中身は記事の一部ではないので潜らない。 */
const NO_DESCEND = new Set(["child_page", "child_database"]);

async function buildTree(blockId: string, limit: ReturnType<typeof limiter>): Promise<BlockNode[]> {
  const blocks = await listChildren(blockId, limit);
  return Promise.all(
    blocks.map(async (block) => ({
      ...block,
      children:
        block.has_children && !NO_DESCEND.has(block.type) ? await buildTree(block.id, limit) : [],
    })),
  );
}

/** 記事本文のブロックを入れ子ごと全部取る。ページングもここで吸収する。 */
export const getPageBlocks = cache(async (pageId: string): Promise<BlockNode[]> => {
  return buildTree(pageId, limiter(CONCURRENCY));
});

/* ------------------------------------------------------------------ */
/* 本文から派生させる情報                                               */
/* ------------------------------------------------------------------ */

export type TocEntry = {
  /** 見出し要素の id。ブロック ID からハイフンを抜いたもの。 */
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

const HEADING_LEVEL: Partial<Record<BlockObjectResponse["type"], 1 | 2 | 3>> = {
  heading_1: 1,
  heading_2: 2,
  heading_3: 3,
  heading_4: 3,
};

export function plainText(rich: RichTextItemResponse[] | undefined): string {
  return (rich ?? []).map((t) => t.plain_text).join("").trim();
}

/** ブロックが持つ本文テキスト（rich_text）を、型を問わず取り出す。 */
export function blockRichText(block: BlockObjectResponse): RichTextItemResponse[] {
  const data = (block as unknown as Record<string, unknown>)[block.type];
  if (data && typeof data === "object" && "rich_text" in data) {
    return (data as { rich_text: RichTextItemResponse[] }).rich_text;
  }
  return [];
}

export function headingAnchor(blockId: string): string {
  return blockId.replace(/-/g, "");
}

function walk(nodes: BlockNode[], visit: (node: BlockNode) => void) {
  for (const node of nodes) {
    visit(node);
    walk(node.children, visit);
  }
}

/** 本文の見出しを順番どおりに拾って目次にする。 */
export function buildToc(blocks: BlockNode[]): TocEntry[] {
  const toc: TocEntry[] = [];
  walk(blocks, (node) => {
    const level = HEADING_LEVEL[node.type];
    if (!level) return;
    const text = plainText(blockRichText(node));
    if (text) toc.push({ id: headingAnchor(node.id), text, level });
  });
  return toc;
}

/** 本文の文字数からおおよその読了時間（分）を出す。
 *  CJK は 500字/分、欧文は 220語/分をめやすにする。 */
export function estimateReadingMinutes(blocks: BlockNode[]): number {
  let cjk = 0;
  let latinWords = 0;

  walk(blocks, (node) => {
    let text = plainText(blockRichText(node));
    if (node.type === "table_row") {
      text = node.table_row.cells.map((cell) => plainText(cell)).join(" ");
    }
    if (!text) return;
    cjk += (text.match(/[㐀-䶿一-鿿぀-ヿ]/g) ?? []).length;
    latinWords += (text.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).length;
  });

  return Math.max(1, Math.round(cjk / 500 + latinWords / 220));
}

/** 本文の先頭の段落。Summary が空のときの meta description に使う。 */
export function firstParagraph(blocks: BlockNode[], max = 160): string {
  const p = blocks.find((b) => b.type === "paragraph" && plainText(b.paragraph.rich_text));
  if (!p || p.type !== "paragraph") return "";
  const text = plainText(p.paragraph.rich_text);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
