import "server-only";

import { cache } from "react";
import { isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client";

import { detectContentLang, type ContentLang } from "@/lib/utils";
import { blogDataSourceId, normalizeId, notion } from "./client";

/**
 * 「Blog Posts」データベースのプロパティ名。Notion 側で名前を変えたらここも変える。
 *
 * - Title        タイトル（タグは入れない）
 * - Status       Draft / Published / Archived。Published だけがサイトに出る
 * - Language     ja / zh / en。記事本文の言語
 * - Tags         マルチセレクト
 * - Published    公開日。一覧の並び順。空なら作成日時で代用する
 * - Summary      一覧カードと meta description（任意）
 * - Translations 同じ内容の他言語版（片側だけ張ってあれば両方向に効く）
 */
export const PROP = {
  title: "Title",
  status: "Status",
  language: "Language",
  tags: "Tags",
  published: "Published",
  summary: "Summary",
  translations: "Translations",
} as const;

const PUBLISHED = "Published";

export type Post = {
  /** Notion のページ ID（ハイフン付き）。URL にもこれを使う。 */
  id: string;
  title: string;
  tags: string[];
  lang: ContentLang;
  /** ISO 8601。Published が空なら作成日時。 */
  publishedAt: string;
  summary: string;
  /** そのまま <img src> に渡せる URL。無ければ null。 */
  cover: string | null;
  /** 他言語版の記事 ID。 */
  translationIds: string[];
};

type Property = PageObjectResponse["properties"][string];

function prop(page: PageObjectResponse, name: string): Property | undefined {
  return page.properties[name];
}

function plain(items: { plain_text: string }[]): string {
  return items.map((t) => t.plain_text).join("").trim();
}

function readTitle(page: PageObjectResponse): string {
  const p = prop(page, PROP.title);
  if (p?.type === "title") return plain(p.title);
  // タイトル列の名前が違っても読めるようにする。
  const any = Object.values(page.properties).find((v) => v.type === "title");
  return any?.type === "title" ? plain(any.title) : "";
}

function readLang(page: PageObjectResponse, title: string): ContentLang {
  const p = prop(page, PROP.language);
  const name = p?.type === "select" ? p.select?.name : undefined;
  if (name === "ja" || name === "zh" || name === "en") return name;
  return detectContentLang(title);
}

/** Notion が保管しているファイルの URL は 1 時間で失効するので、自前のルートを通す。 */
export function coverUrl(page: PageObjectResponse): string | null {
  const cover = page.cover;
  if (!cover) return null;
  if (cover.type === "external") {
    const url = cover.external.url;
    // Notion 組み込みのカバーは相対パスで返ることがある。
    return url.startsWith("/") ? `https://www.notion.so${url}` : url;
  }
  return `/api/notion-asset/cover/${normalizeId(page.id)}`;
}

function toPost(page: PageObjectResponse): Post {
  const title = readTitle(page);
  const tags = prop(page, PROP.tags);
  const published = prop(page, PROP.published);
  const summary = prop(page, PROP.summary);
  const translations = prop(page, PROP.translations);

  return {
    id: page.id,
    title,
    tags: tags?.type === "multi_select" ? tags.multi_select.map((t) => t.name) : [],
    lang: readLang(page, title),
    publishedAt:
      (published?.type === "date" && published.date?.start) || page.created_time,
    summary: summary?.type === "rich_text" ? plain(summary.rich_text) : "",
    cover: coverUrl(page),
    translationIds:
      translations?.type === "relation" ? translations.relation.map((r) => r.id) : [],
  };
}

/**
 * 公開中の記事を新しい順に全件返す。
 * 同じリクエスト内（一覧・前後リンク・翻訳リンク）では 1 回だけ問い合わせる。
 */
export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion().dataSources.query({
      data_source_id: blogDataSourceId(),
      filter: { property: PROP.status, select: { equals: PUBLISHED } },
      sorts: [
        { property: PROP.published, direction: "descending" },
        { timestamp: "created_time", direction: "descending" },
      ],
      start_cursor: cursor,
      page_size: 100,
    });
    for (const r of res.results) {
      if (r.object === "page" && isFullPage(r)) pages.push(r);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  const posts = pages.map(toPost).filter((p) => p.title);

  // 翻訳の関連は片側だけ張られていても両方向に効かせる。
  const byId = new Map(posts.map((p) => [normalizeId(p.id), p]));
  for (const post of posts) {
    for (const otherId of post.translationIds) {
      const other = byId.get(normalizeId(otherId));
      if (other && !other.translationIds.some((id) => normalizeId(id) === normalizeId(post.id))) {
        other.translationIds.push(post.id);
      }
    }
  }
  // 非公開の記事への関連は落とす。
  for (const post of posts) {
    post.translationIds = post.translationIds.filter((id) => byId.has(normalizeId(id)));
  }

  // Published が空の行は created_time で埋めているので、最後に並べ直す。
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

/** 公開中の記事だけを返す。下書きや他のページの ID では null。 */
export async function getPublishedPost(id: string): Promise<Post | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => normalizeId(p.id) === normalizeId(id)) ?? null;
}
