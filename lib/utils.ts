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