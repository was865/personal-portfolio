import aboutSnapshot from "@/content/about.json"
import experiencesSnapshot from "@/content/experiences.json"
import photosSnapshot from "@/content/photos.json"
import projectsSnapshot from "@/content/projects.json"
import skillsSnapshot from "@/content/skills.json"

import type { CollectionName } from "./schema"

/**
 * リポジトリに置いたコンテンツの写し。
 *
 * 真実の出所は Vercel Blob 側だが、これは 3 つの役目を持つ:
 *   1. Blob が読めないときの表示保険（サイトを落とさない）
 *   2. `BLOB_READ_WRITE_TOKEN` 未設定のローカル開発・CI の既定値
 *   3. Claude が現在の内容を git 上で読むための写し
 *
 * fs ではなく import で持つので、サーバレス環境でもファイル同梱の心配がいらない。
 * Blob 側を更新したら `pnpm cms pull` でここへ書き戻す。
 */
const snapshots: Record<CollectionName, unknown> = {
  projects: projectsSnapshot,
  experiences: experiencesSnapshot,
  skills: skillsSnapshot,
  photos: photosSnapshot,
  about: aboutSnapshot,
}

export function readSnapshot(name: CollectionName): unknown {
  return snapshots[name]
}
