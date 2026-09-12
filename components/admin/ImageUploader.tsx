"use client"

import { upload } from "@vercel/blob/client"
import { useRef, useState } from "react"

import type { ImageRef } from "@/lib/cms/schema"
import { Button } from "./ui"

type Props = {
  kind: "photo" | "shot"
  label: string
  multiple?: boolean
  onUploaded: (images: ImageRef[]) => void
}

/**
 * 画像を Blob へ直接上げ、サーバで webp に変換してから `ImageRef` を返す。
 *
 * サーバ経由にしないのは Vercel の関数がリクエスト本文 4.5MB 上限で、
 * iPhone の写真が普通にそれを超えるため。
 */
export function ImageUploader({ kind, label, multiple = true, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList) {
    setBusy(true)
    setError(null)

    const uploaded: ImageRef[] = []
    try {
      let index = 0
      for (const file of Array.from(files)) {
        index += 1
        setProgress(`${index} / ${files.length} 枚目を処理中…`)

        const blob = await upload(`media/tmp/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          contentType: file.type || undefined,
        })

        const response = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: blob.url, kind }),
        })

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body.detail ?? `${file.name} の変換に失敗しました`)
        }

        const { image } = (await response.json()) as { image: ImageRef }
        uploaded.push(image)
      }

      if (uploaded.length > 0) onUploaded(uploaded)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "アップロードに失敗しました")
    } finally {
      setBusy(false)
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(event) => {
          if (event.target.files?.length) void handleFiles(event.target.files)
        }}
      />

      <Button onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? (progress ?? "処理中…") : label}
      </Button>

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
