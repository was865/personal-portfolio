import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// タイトルからタグを抽出する関数
export const extractTags = (title: string | null) => {
  if (!title) return [];
  const tagMatch = title.match(/\[(.*?)\]$/);
  if (!tagMatch) return [];
  
  return tagMatch[1].split(',').map(tag => tag.trim());
}

// タグなしのタイトルを取得する関数
export const getTitleWithoutTags = (title: string | null) => {
  if (!title) return '';
  return title.replace(/\[.*?\]$/, '').trim();
}
/** 記事の表記言語。UI の言語とは別物で、日本語UIに中文記事が並ぶことがある。 */
export type ContentLang = "ja" | "zh" | "en";

const KANA = /[぀-ヿ]/; // ひらがな・カタカナ
const HAN = /[㐀-䶿一-鿿]/; // 漢字

/**
 * タイトル本文から表記言語を推定する。
 * かなが1文字でもあれば日本語。かなが無く漢字があれば中国語。
 * どちらも無ければ欧文として扱う。
 *
 * 漢字だけの短い日本語タイトル（例:「型安全」）は中国語と判定されるが、
 * その場合でも字形が簡体字寄りになるだけで表示は崩れない。
 */
export const detectContentLang = (text: string | null | undefined): ContentLang => {
  if (!text) return "en";
  if (KANA.test(text)) return "ja";
  if (HAN.test(text)) return "zh";
  return "en";
};
