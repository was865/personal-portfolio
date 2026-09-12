/**
 * lib/data.ts の内容を content/*.json（CMS のスナップショット）へ変換する一度きりの移行スクリプト。
 *
 * data.ts は react-icons の React 要素と Next の静的画像 import を含むので、素の node では読めない。
 * vite の SSR ローダで読み込み、アイコンは関数名（FaCode など）へ、画像はパス文字列へ落とす。
 * 画像の幅高さは sharp で実測して埋める（`<Image>` のレイアウトシフト防止のため必須）。
 *
 *   node scripts/migrate-content.mjs
 */
import { createHash } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"
import { createServer } from "vite"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = path.join(root, "content")

/** `/public/images/a.webp` → `/images/a.webp`。サイトから見える URL に直す。 */
function toPublicUrl(viteUrl) {
  const normalized = String(viteUrl).replace(/\\/g, "/")
  const index = normalized.indexOf("/public/")
  const url = index === -1 ? normalized : normalized.slice(index + "/public".length)
  return url.split("?")[0]
}

/** React 要素からアイコン名を取り出す。`React.createElement(FaCode)` → "FaCode"。 */
function iconNameOf(element) {
  const name = element?.type?.name
  if (!name) throw new Error(`アイコン名を取り出せない: ${JSON.stringify(element?.type)}`)
  return name
}

async function measure(publicUrl) {
  const file = path.join(root, "public", publicUrl.replace(/^\//, ""))
  const { width, height } = await sharp(file).metadata()
  if (!width || !height) throw new Error(`画像の寸法を取得できない: ${file}`)
  return { width, height }
}

async function imageRef(publicUrl) {
  return { url: publicUrl, ...(await measure(publicUrl)) }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

async function main() {
  const server = await createServer({
    root,
    // public/ を Vite の静的ディレクトリ扱いにすると JS からの import が拒否される
    publicDir: false,
    configFile: false,
    logLevel: "warn",
    appType: "custom",
    server: { middlewareMode: true },
    resolve: { alias: { "@": root } },
  })

  try {
    const data = await server.ssrLoadModule("/lib/data.ts")

    // --- 経歴: 3 本の並行配列を 1 本へ畳む ---
    const { experiencesData: en, experiencesDataJa: ja, experiencesDataZn: zh } = data
    if (en.length !== ja.length || en.length !== zh.length) {
      throw new Error("経歴の 3 言語で件数が違う。手で揃えてから再実行する")
    }
    const experiences = {
      items: en.map((item, i) => ({
        id: slugify(item.title),
        order: i,
        title: { en: item.title, ja: ja[i].title, zh: zh[i].title },
        location: { en: item.location, ja: ja[i].location, zh: zh[i].location },
        description: { en: item.description, ja: ja[i].description, zh: zh[i].description },
        icon: iconNameOf(item.icon),
        date: { en: item.date, ja: ja[i].date, zh: zh[i].date },
      })),
    }

    // --- プロジェクト: title_zh / desc_ja の二流儀を L へ正規化 ---
    const projects = {
      items: await Promise.all(
        data.projectsData.map(async (p, i) => ({
          slug: p.slug,
          order: i,
          visible: true,
          title: { en: p.title, ja: p.title_ja, zh: p.title_zh },
          description: { en: p.description, ja: p.desc_ja, zh: p.desc_zh },
          tags: [...p.tags],
          caseStudy: {
            problem: p.caseStudy.problem,
            role: p.caseStudy.role,
            decisions: p.caseStudy.decisions,
            result: p.caseStudy.result,
          },
          shots: await Promise.all(
            p.shots.map(async (shot) => ({
              image: await imageRef(toPublicUrl(shot.src)),
              caption: shot.caption,
            })),
          ),
          ...(p.demoUrl && p.demoUrl !== "#" ? { demoUrl: p.demoUrl } : {}),
        })),
      ),
    }

    // --- スキル ---
    const skills = {
      groups: data.skillGroups.map((g) => ({ key: g.key, ids: [...g.ids] })),
      items: data.skillsDataWithIcons.map((s) => ({
        id: s.id,
        name: s.name,
        icon: iconNameOf(s.icon),
        desc: s.desc,
      })),
    }

    // --- 写真: public/images/photos の中身をそのまま取り込む ---
    const photoDir = path.join(root, "public", "images", "photos")
    const files = (await fs.readdir(photoDir))
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort()
    const photos = {
      items: await Promise.all(
        files.map(async (file, i) => ({
          // ファイル名は iPhone の書き出しのままで読めないので、安定した短い id を振る
          id: createHash("sha1").update(file).digest("hex").slice(0, 12),
          order: i,
          image: await imageRef(`/images/photos/${file}`),
        })),
      ),
    }

    // --- 文言: 既定値はリポジトリの messages/*.json。CMS 側は空から始める ---
    const about = { messages: { en: {}, ja: {}, zh: {} } }

    await fs.mkdir(contentDir, { recursive: true })
    for (const [name, value] of Object.entries({
      projects,
      experiences,
      skills,
      photos,
      about,
    })) {
      const file = path.join(contentDir, `${name}.json`)
      await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8")
      const count = value.items?.length ?? Object.keys(value.messages ?? {}).length
      console.log(`${path.relative(root, file)}: ${count} 件`)
    }
  } finally {
    await server.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
