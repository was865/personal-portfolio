"use client"

import Link from "next/link"
import { use } from "react"

import { ImageUploader } from "@/components/admin/ImageUploader"
import { useCollection } from "@/components/admin/useCollection"
import {
  AdminLocaleProvider,
  Button,
  Card,
  Field,
  LocaleTabs,
  LocalizedField,
  MoveButtons,
  SaveBar,
  TextInput,
} from "@/components/admin/ui"
import type { L, Project } from "@/lib/cms/schema"

const EMPTY: L<string> = { en: "", ja: "", zh: "" }

export default function ProjectEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  return (
    <AdminLocaleProvider>
      <Editor slug={slug} />
    </AdminLocaleProvider>
  )
}

function Editor({ slug }: { slug: string }) {
  const { status, data, dirty, saving, error, setData, save, reload } = useCollection("projects")

  if (status === "loading" || !data) return <p className="py-10 text-sm">読み込み中…</p>

  const project = data.items.find((item) => item.slug === slug)
  if (!project) {
    return (
      <main className="py-10">
        <p className="mb-4 text-sm">このプロジェクトは見つかりませんでした。</p>
        <Link href="/admin/projects" className="text-sm underline">
          一覧へ戻る
        </Link>
      </main>
    )
  }

  const update = (patch: Partial<Project>) =>
    setData((current) => ({
      ...current,
      items: current.items.map((item) => (item.slug === slug ? { ...item, ...patch } : item)),
    }))

  const updateShots = (shots: Project["shots"]) => update({ shots })

  return (
    <main>
      <Link href="/admin/projects" className="text-sm text-gray-500 underline dark:text-white/50">
        ← プロジェクト一覧
      </Link>

      <h1 className="mb-1 mt-3 text-xl font-semibold">{project.slug}</h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-white/50">
        空欄の項目はサイトに出ません。書ける言語だけ書けば大丈夫です。
      </p>

      <div className="mb-4">
        <LocaleTabs />
      </div>

      <Card className="space-y-3">
        <LocalizedField label="タイトル" value={project.title} onChange={(title) => update({ title })} />
        <LocalizedField
          label="説明"
          value={project.description}
          onChange={(description) => update({ description })}
          multiline
          rows={6}
        />
        <Field label="タグ" hint="カンマ区切り">
          <TextInput
            value={project.tags.join(", ")}
            onChange={(value) =>
              update({
                tags: value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
      </Card>

      <h2 className="mb-2 mt-6 text-sm font-semibold">事例の骨格</h2>
      <Card className="space-y-3">
        <LocalizedField
          label="課題"
          value={project.caseStudy.problem}
          onChange={(problem) => update({ caseStudy: { ...project.caseStudy, problem } })}
          multiline
        />
        <LocalizedField
          label="担当"
          value={project.caseStudy.role}
          onChange={(role) => update({ caseStudy: { ...project.caseStudy, role } })}
          multiline
        />
        <LocalizedField
          label="判断"
          value={project.caseStudy.decisions}
          onChange={(decisions) => update({ caseStudy: { ...project.caseStudy, decisions } })}
          multiline
        />
        <LocalizedField
          label="結果"
          value={project.caseStudy.result}
          onChange={(result) => update({ caseStudy: { ...project.caseStudy, result } })}
          multiline
        />
      </Card>

      <h2 className="mb-2 mt-6 text-sm font-semibold">画面（{project.shots.length} 枚）</h2>

      <div className="mb-4">
        <ImageUploader
          kind="shot"
          label="画面を追加"
          onUploaded={(images) =>
            updateShots([
              ...project.shots,
              ...images.map((image) => ({ image, caption: { ...EMPTY } })),
            ])
          }
        />
      </div>

      <ul className="space-y-3">
        {project.shots.map((shot, index) => (
          <li key={shot.image.url}>
            <Card className="space-y-3">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.image.thumbUrl ?? shot.image.url}
                  alt=""
                  className="h-20 w-28 shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <LocalizedField
                    label={`説明 ${String(index + 1).padStart(2, "0")}`}
                    value={shot.caption}
                    onChange={(caption) =>
                      updateShots(
                        project.shots.map((entry, position) =>
                          position === index ? { ...entry, caption } : entry,
                        ),
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <MoveButtons
                  index={index}
                  count={project.shots.length}
                  onMove={(from, to) => {
                    if (to < 0 || to >= project.shots.length) return
                    const shots = [...project.shots]
                    const [moved] = shots.splice(from, 1)
                    shots.splice(to, 0, moved)
                    updateShots(shots)
                  }}
                />
                <Button
                  variant="danger"
                  className="min-h-9 px-3"
                  onClick={() => updateShots(project.shots.filter((_, position) => position !== index))}
                >
                  削除
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <SaveBar
        dirty={dirty}
        saving={saving}
        error={error}
        onSave={() => void save()}
        onReload={() => void reload()}
      />
    </main>
  )
}
