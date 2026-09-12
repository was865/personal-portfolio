import { byOrder, type Experience, type Photo, type Project, type Skill, type SkillGroup } from "./schema"
import { readCollection } from "./store"

/**
 * サイト表示側から使うコンテンツ取得。
 *
 * 並び順・非表示の扱いをここに閉じ込め、ページからは「表示すべきものが order 順で並んだ配列」
 * だけが見えるようにする。キャッシュは `readCollection` 側（タグ付き）。
 */

export async function getProjects(): Promise<Project[]> {
  const { items } = await readCollection("projects")
  return byOrder(items.filter((item) => item.visible))
}

export async function getExperiences(): Promise<Experience[]> {
  const { items } = await readCollection("experiences")
  return byOrder(items)
}

export async function getSkills(): Promise<{ groups: SkillGroup[]; items: Skill[] }> {
  return readCollection("skills")
}

export async function getPhotos(): Promise<Photo[]> {
  const { items } = await readCollection("photos")
  return byOrder(items)
}

/** 表示用に毎回違う顔ぶれを出す（従来の getRandomPhotos と同じ挙動）。 */
export function shuffle<T>(items: readonly T[], count: number): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}
