import Link from "next/link";
import type { RichTextItemResponse } from "@notionhq/client";

import type { BlockNode } from "@/lib/notion/blocks";
import { headingAnchor, plainText } from "@/lib/notion/blocks";
import { highlight } from "@/lib/notion/highlight";
import { normalizeId } from "@/lib/notion/client";
import { cn } from "@/lib/utils";
import { RichText, colorClass, resolveHref, type RenderContext } from "./RichText";

/**
 * 公式 API のブロックを HTML にする。サーバコンポーネントなので、
 * 本文は最初の HTML に入り、検索エンジンにもそのまま読める。
 *
 * 対応していないブロック（子データベース、テンプレートなど）は描画しない。
 * 記事で新しいブロックを使ったらここに足す。
 */

type MediaValue =
  | { type: "file"; file: { url: string }; caption?: RichTextItemResponse[] }
  | { type: "external"; external: { url: string }; caption?: RichTextItemResponse[] };

/** Notion が保管するファイルは署名が切れるので中継ルートを通す。外部 URL はそのまま。 */
function mediaSrc(block: BlockNode, media: MediaValue): string {
  return media.type === "file"
    ? `/api/notion-asset/block/${normalizeId(block.id)}`
    : media.external.url;
}

function mediaOf(block: BlockNode): MediaValue {
  return (block as unknown as Record<string, MediaValue>)[block.type];
}

function youTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Caption({ value, ctx }: { value?: RichTextItemResponse[]; ctx: RenderContext }) {
  if (!value?.length) return null;
  return (
    <figcaption className="n-caption">
      <RichText value={value} ctx={ctx} />
    </figcaption>
  );
}

function Children({ nodes, ctx }: { nodes: BlockNode[]; ctx: RenderContext }) {
  if (!nodes.length) return null;
  return (
    <div className="n-children">
      <NotionBlocks blocks={nodes} ctx={ctx} />
    </div>
  );
}

function LinkCard({ url, caption }: { url: string; caption?: RichTextItemResponse[] }) {
  const label = caption?.length ? plainText(caption) : url;
  return (
    <a href={url} className="n-bookmark" target="_blank" rel="noopener noreferrer">
      <span className="n-bookmark-title">{label}</span>
      <span className="n-bookmark-host">{hostOf(url)}</span>
    </a>
  );
}

function CodeBlock({ block, ctx }: { block: Extract<BlockNode, { type: "code" }>; ctx: RenderContext }) {
  const code = block.code.rich_text.map((t) => t.plain_text).join("");
  const language = block.code.language;
  const html = highlight(code, language);

  return (
    <figure className="n-code">
      <div className="n-code-lang">{language === "plain text" ? "text" : language}</div>
      <pre className={html ? `language-${language}` : undefined}>
        {html ? (
          <code dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
      <Caption value={block.code.caption} ctx={ctx} />
    </figure>
  );
}

function Heading({ block, ctx }: { block: BlockNode; ctx: RenderContext }) {
  if (
    block.type !== "heading_1" &&
    block.type !== "heading_2" &&
    block.type !== "heading_3" &&
    block.type !== "heading_4"
  ) {
    return null;
  }
  const data =
    block.type === "heading_1"
      ? block.heading_1
      : block.type === "heading_2"
        ? block.heading_2
        : block.type === "heading_3"
          ? block.heading_3
          : block.heading_4;

  // ページタイトルが h1 なので、本文の見出しは h2 から始める。
  const Tag = block.type === "heading_1" ? "h2" : block.type === "heading_2" ? "h3" : "h4";
  const heading = (
    <Tag id={headingAnchor(block.id)} className={cn("n-heading", `n-${block.type}`, colorClass(data.color))}>
      <RichText value={data.rich_text} ctx={ctx} />
    </Tag>
  );

  if (data.is_toggleable) {
    return (
      <details className="n-toggle">
        <summary>{heading}</summary>
        <Children nodes={block.children} ctx={ctx} />
      </details>
    );
  }
  return heading;
}

function Block({ block, ctx }: { block: BlockNode; ctx: RenderContext }) {
  switch (block.type) {
    case "paragraph": {
      const { rich_text, color } = block.paragraph;
      if (!rich_text.length && !block.children.length) {
        return <div className="n-spacer" aria-hidden />;
      }
      return (
        <>
          <p className={cn("n-paragraph", colorClass(color))}>
            <RichText value={rich_text} ctx={ctx} />
          </p>
          <Children nodes={block.children} ctx={ctx} />
        </>
      );
    }

    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "heading_4":
      return <Heading block={block} ctx={ctx} />;

    case "quote":
      return (
        <blockquote className={cn("n-quote", colorClass(block.quote.color))}>
          <RichText value={block.quote.rich_text} ctx={ctx} />
          <Children nodes={block.children} ctx={ctx} />
        </blockquote>
      );

    case "callout": {
      const icon = block.callout.icon;
      return (
        <div className={cn("n-callout", colorClass(block.callout.color))}>
          {icon?.type === "emoji" && (
            <span className="n-callout-icon" aria-hidden>
              {icon.emoji}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <RichText value={block.callout.rich_text} ctx={ctx} />
            <Children nodes={block.children} ctx={ctx} />
          </div>
        </div>
      );
    }

    case "toggle":
      return (
        <details className="n-toggle">
          <summary>
            <RichText value={block.toggle.rich_text} ctx={ctx} />
          </summary>
          <Children nodes={block.children} ctx={ctx} />
        </details>
      );

    case "to_do":
      return (
        <div className="n-todo">
          <input type="checkbox" checked={block.to_do.checked} readOnly disabled aria-hidden />
          <div className={cn(block.to_do.checked && "line-through opacity-60")}>
            <RichText value={block.to_do.rich_text} ctx={ctx} />
            <Children nodes={block.children} ctx={ctx} />
          </div>
        </div>
      );

    case "divider":
      return <hr className="n-divider" />;

    case "code":
      return <CodeBlock block={block} ctx={ctx} />;

    case "equation":
      return (
        <div className="n-equation">
          <code>{block.equation.expression}</code>
        </div>
      );

    case "image": {
      const media = mediaOf(block);
      return (
        <figure className="n-image">
          {/* 寸法が API から取れないので next/image ではなく素の img にする。 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaSrc(block, media)}
            alt={plainText(media.caption) || ""}
            loading="lazy"
            decoding="async"
          />
          <Caption value={media.caption} ctx={ctx} />
        </figure>
      );
    }

    case "video": {
      const media = mediaOf(block);
      const src = mediaSrc(block, media);
      const yt = media.type === "external" ? youTubeId(src) : null;
      if (yt) {
        return (
          <figure className="n-embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${yt}`}
              title={plainText(media.caption) || "YouTube video"}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <Caption value={media.caption} ctx={ctx} />
          </figure>
        );
      }
      if (media.type === "file") {
        return (
          <figure className="n-image">
            <video src={src} controls preload="metadata" />
            <Caption value={media.caption} ctx={ctx} />
          </figure>
        );
      }
      return <LinkCard url={src} caption={media.caption} />;
    }

    case "audio": {
      const media = mediaOf(block);
      return (
        <figure className="n-image">
          <audio src={mediaSrc(block, media)} controls preload="none" className="w-full" />
          <Caption value={media.caption} ctx={ctx} />
        </figure>
      );
    }

    case "file":
    case "pdf": {
      const media = mediaOf(block);
      const name =
        (block.type === "file" && block.file.name) || plainText(media.caption) || block.type.toUpperCase();
      return (
        <a href={mediaSrc(block, media)} className="n-bookmark" target="_blank" rel="noopener noreferrer">
          <span className="n-bookmark-title">📎 {name}</span>
        </a>
      );
    }

    case "embed": {
      const yt = youTubeId(block.embed.url);
      if (yt) {
        return (
          <figure className="n-embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${yt}`}
              title="YouTube video"
              loading="lazy"
              allowFullScreen
            />
            <Caption value={block.embed.caption} ctx={ctx} />
          </figure>
        );
      }
      // 任意のサイトを iframe で埋めるのは避け、リンクにする。
      return <LinkCard url={block.embed.url} caption={block.embed.caption} />;
    }

    case "bookmark":
      return <LinkCard url={block.bookmark.url} caption={block.bookmark.caption} />;

    case "link_preview":
      return <LinkCard url={block.link_preview.url} />;

    case "table": {
      const { has_column_header, has_row_header } = block.table;
      const rows = block.children.filter((r) => r.type === "table_row");
      return (
        <div className="n-table-wrap">
          <table className="n-table">
            <tbody>
              {rows.map((row, r) => {
                if (row.type !== "table_row") return null;
                return (
                  <tr key={row.id}>
                    {row.table_row.cells.map((cell, c) => {
                      const header = (has_column_header && r === 0) || (has_row_header && c === 0);
                      const Cell = header ? "th" : "td";
                      return (
                        <Cell key={c} scope={header ? (r === 0 ? "col" : "row") : undefined}>
                          <RichText value={cell} ctx={ctx} />
                        </Cell>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    case "column_list":
      return (
        <div className="n-columns">
          {block.children.map((col) =>
            col.type === "column" ? (
              <div
                key={col.id}
                className="n-column"
                style={col.column.width_ratio ? { flexGrow: col.column.width_ratio } : undefined}
              >
                <NotionBlocks blocks={col.children} ctx={ctx} />
              </div>
            ) : null,
          )}
        </div>
      );

    case "synced_block":
      return <NotionBlocks blocks={block.children} ctx={ctx} />;

    case "link_to_page": {
      const target = block.link_to_page;
      if (target.type !== "page_id") return null;
      return <PageLink id={target.page_id} ctx={ctx} />;
    }

    case "child_page":
      return <PageLink id={block.id} ctx={ctx} />;

    default:
      // table_of_contents（目次は横に出している）、breadcrumb、child_database など。
      return null;
  }
}

/** 記事へのリンクブロック。公開中の記事でなければ何も出さない。 */
function PageLink({ id, ctx }: { id: string; ctx: RenderContext }) {
  const title = ctx.posts.get(normalizeId(id));
  const href = resolveHref(`/${id}`, ctx);
  if (!title || !href) return null;
  return (
    <p className="n-paragraph">
      <Link href={href} className="n-link">
        → {title}
      </Link>
    </p>
  );
}

type ListType = "bulleted_list_item" | "numbered_list_item";

/** 連続する箇条書きを 1 つの <ul>/<ol> にまとめる。API は 1 項目 = 1 ブロックで返す。 */
function groupLists(blocks: BlockNode[]) {
  const groups: ({ list: ListType; items: BlockNode[] } | BlockNode)[] = [];
  for (const block of blocks) {
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const last = groups[groups.length - 1];
      if (last && "list" in last && last.list === block.type) {
        last.items.push(block);
      } else {
        groups.push({ list: block.type, items: [block] });
      }
    } else {
      groups.push(block);
    }
  }
  return groups;
}

function ListItem({ block, ctx }: { block: BlockNode; ctx: RenderContext }) {
  if (block.type !== "bulleted_list_item" && block.type !== "numbered_list_item") return null;
  const data = block.type === "bulleted_list_item" ? block.bulleted_list_item : block.numbered_list_item;
  return (
    <li className={colorClass(data.color)}>
      <RichText value={data.rich_text} ctx={ctx} />
      {block.children.length > 0 && <NotionBlocks blocks={block.children} ctx={ctx} />}
    </li>
  );
}

export function NotionBlocks({ blocks, ctx }: { blocks: BlockNode[]; ctx: RenderContext }) {
  return (
    <>
      {groupLists(blocks).map((group) => {
        if ("list" in group) {
          const first = group.items[0];
          if (group.list === "numbered_list_item" && first.type === "numbered_list_item") {
            return (
              <ol key={first.id} className="n-list n-ol" start={first.numbered_list_item.list_start_index}>
                {group.items.map((item) => (
                  <ListItem key={item.id} block={item} ctx={ctx} />
                ))}
              </ol>
            );
          }
          return (
            <ul key={first.id} className="n-list n-ul">
              {group.items.map((item) => (
                <ListItem key={item.id} block={item} ctx={ctx} />
              ))}
            </ul>
          );
        }
        return <Block key={group.id} block={group} ctx={ctx} />;
      })}
    </>
  );
}
