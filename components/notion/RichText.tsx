import Link from "next/link";
import type { RichTextItemResponse } from "@notionhq/client";

import { cn } from "@/lib/utils";

/** 本文中のリンクを解決するための情報。サーバで作って描画に渡す。 */
export type RenderContext = {
  locale: string;
  /** 公開中の記事。キーは ID（ハイフン無し・小文字）、値はタイトル。 */
  posts: Map<string, string>;
};

const NOTION_ID = /([0-9a-f]{32})(?:[?#].*)?$/i;

/**
 * Notion 内のページへのリンクを、公開中の記事ならサイト内 URL に置き換える。
 * 記事以外の Notion ページ（非公開）へのリンクは読者には開けないので、リンクを外す。
 */
export function resolveHref(href: string, ctx: RenderContext): string | null {
  const isNotion =
    href.startsWith("/") || /^https?:\/\/([a-z0-9-]+\.)?notion\.(so|site|com)\//i.test(href);
  if (!isNotion) return href;

  const id = href.replace(/-/g, "").match(NOTION_ID)?.[1]?.toLowerCase();
  if (id && ctx.posts.has(id)) return `/${ctx.locale}/blog/${id}`;
  return null;
}

/** Notion の文字色・背景色を globals.css の n-color-* / n-bg-* に写す。 */
export function colorClass(color: string | undefined): string | undefined {
  if (!color || color === "default") return undefined;
  return color.endsWith("_background")
    ? `n-bg-${color.replace("_background", "")}`
    : `n-color-${color}`;
}

function Segment({ item, ctx }: { item: RichTextItemResponse; ctx: RenderContext }) {
  const { bold, italic, strikethrough, underline, code, color } = item.annotations;

  let text: React.ReactNode = item.plain_text;
  if (item.type === "equation") {
    text = <code className="n-inline-code">{item.equation.expression}</code>;
  } else if (code) {
    text = <code className="n-inline-code">{text}</code>;
  }

  const classes = cn(
    bold && "font-semibold",
    italic && "italic",
    strikethrough && "line-through",
    underline && "underline underline-offset-4",
    colorClass(color),
  );
  const styled = classes ? <span className={classes}>{text}</span> : text;

  // ページへのメンションは href を持たないので ID から組み立てる。
  let href = item.href;
  if (!href && item.type === "mention" && item.mention.type === "page") {
    href = `/${item.mention.page.id}`;
  }
  if (!href) return <>{styled}</>;

  const resolved = resolveHref(href, ctx);
  if (!resolved) return <>{styled}</>;
  if (resolved.startsWith("/")) {
    return (
      <Link href={resolved} className="n-link">
        {styled}
      </Link>
    );
  }
  return (
    <a href={resolved} className="n-link" target="_blank" rel="noopener noreferrer">
      {styled}
    </a>
  );
}

export function RichText({
  value,
  ctx,
}: {
  value: RichTextItemResponse[];
  ctx: RenderContext;
}) {
  return (
    <>
      {value.map((item, i) => (
        <Segment key={i} item={item} ctx={ctx} />
      ))}
    </>
  );
}
