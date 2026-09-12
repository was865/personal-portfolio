import { z } from "zod"

/** サイトが持つ言語。`i18n/routing.ts` の locales と同じ並び。 */
export const LOCALES = ["en", "ja", "zh"] as const

export type Locale = (typeof LOCALES)[number]

/** 多言語テキスト。3 言語すべてを必須にして、片言語だけ抜けた状態を作らせない。 */
export type L<T = string> = Record<Locale, T>

const localized = z.object({
  en: z.string(),
  ja: z.string(),
  zh: z.string(),
})

/** 画像参照。幅高さを必須にして `<Image>` のレイアウトシフトを防ぐ。 */
const imageRef = z.object({
  url: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  thumbUrl: z.string().min(1).optional(),
  /** 読み込み中に出すぼかし。無ければ `placeholder="empty"` になるだけで壊れない。 */
  blurDataURL: z.string().startsWith("data:image/").optional(),
})

export type ImageRef = z.infer<typeof imageRef>

/** アイコンは名前で持つ。解決は `config/icon-registry.ts` の許可リストが行う。 */
const iconName = z.string().min(1).max(40)

const projectShot = z.object({
  image: imageRef,
  caption: localized,
})

export const projectsSchema = z.object({
  items: z.array(
    z.object({
      slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, "slug は小文字英数字とハイフンのみ"),
      order: z.number().int(),
      visible: z.boolean().default(true),
      title: localized,
      description: localized,
      tags: z.array(z.string().min(1)),
      caseStudy: z.object({
        problem: localized,
        role: localized,
        decisions: localized,
        result: localized,
      }),
      shots: z.array(projectShot),
      demoUrl: z.string().optional(),
    }),
  ),
})

export const experiencesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int(),
      title: localized,
      location: localized,
      description: localized,
      icon: iconName,
      date: localized,
    }),
  ),
})

export const skillsSchema = z.object({
  /** 表示するまとまり。`ids` は items の id を指す。ここに無い item は表示されない。 */
  groups: z.array(
    z.object({
      key: z.string().min(1),
      ids: z.array(z.string().min(1)),
    }),
  ),
  items: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      icon: iconName,
      desc: localized,
    }),
  ),
})

export const photosSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int(),
      image: imageRef,
      caption: localized.optional(),
    }),
  ),
})

/** messages の部分木。next-intl の名前空間構造をそのまま受ける。 */
const messageTree: z.ZodType<Record<string, unknown>> = z.lazy(() =>
  z.record(z.string(), z.union([z.string(), messageTree])),
)

export const aboutSchema = z.object({
  // 未知の言語キーは黙って捨てずに弾く。typo に気づけないと「保存したのに反映されない」になる。
  messages: z
    .strictObject({
      en: messageTree.optional(),
      ja: messageTree.optional(),
      zh: messageTree.optional(),
    })
    .optional(),
})

export const collectionSchemas = {
  projects: projectsSchema,
  experiences: experiencesSchema,
  skills: skillsSchema,
  photos: photosSchema,
  about: aboutSchema,
} as const

export type CollectionName = keyof typeof collectionSchemas

export const COLLECTION_NAMES = Object.keys(collectionSchemas) as CollectionName[]

export function isCollectionName(value: string): value is CollectionName {
  return value in collectionSchemas
}

export type ProjectsData = z.infer<typeof projectsSchema>
export type ExperiencesData = z.infer<typeof experiencesSchema>
export type SkillsData = z.infer<typeof skillsSchema>
export type PhotosData = z.infer<typeof photosSchema>
export type AboutData = z.infer<typeof aboutSchema>

export type Project = ProjectsData["items"][number]
export type ProjectShot = Project["shots"][number]
export type Experience = ExperiencesData["items"][number]
export type Skill = SkillsData["items"][number]
export type SkillGroup = SkillsData["groups"][number]
export type Photo = PhotosData["items"][number]

export type CollectionData = {
  projects: ProjectsData
  experiences: ExperiencesData
  skills: SkillsData
  photos: PhotosData
  about: AboutData
}

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** 多言語テキストから今の言語の値を取り出す。未知の言語は en に落とす。 */
export function pick<T>(value: L<T>, locale: string): T {
  return isLocale(locale) ? value[locale] : value.en
}

/** 並び順は order の昇順。同値なら元の並びを保つ。 */
export function byOrder<T extends { order: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order)
}
