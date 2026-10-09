import "server-only";

import { Client } from "@notionhq/client";

/**
 * 公式 Notion API のクライアント。
 *
 * 以前は非公式 API（notion-client）でページを「Web に公開」して読んでいたが、
 * 1 回 100 ブロックまでしか返らない・User-Agent で 403 になる・応答の形が
 * 予告なく変わる、と何度も壊れた。いまは内部インテグレーションのトークンで
 * 「Blog Posts」データベースだけを読む。ワークスペースを公開する必要はない。
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. See README の「ブログ（Notion）」.`);
  }
  return value;
}

let client: Client | null = null;

export function notion(): Client {
  client ??= new Client({
    auth: requireEnv("NOTION_TOKEN"),
    // ローカルでモックサーバーに向けて動作確認するためだけの逃げ道。
    baseUrl: process.env.NOTION_API_BASE_URL || undefined,
  });
  return client;
}

/** 記事を入れているデータソース（データベース）の ID。 */
export function blogDataSourceId(): string {
  return requireEnv("NOTION_BLOG_DATA_SOURCE_ID");
}

/** ハイフンの有無を揃えて比較するため。URL には無い形、API は有る形で返る。 */
export function normalizeId(id: string): string {
  return id.replace(/-/g, "").toLowerCase();
}
