"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button, Card, Field, TextInput } from "@/components/admin/ui"

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    setError(null)

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      router.replace("/admin")
      router.refresh()
      return
    }

    const body = await response.json().catch(() => ({}))
    setError(
      body.error === "not_configured"
        ? "CMS_ADMIN_PASSWORD_HASH が未設定です。`pnpm cms hash-password` で作って環境変数に入れてください。"
        : "パスワードが違います。",
    )
    setPassword("")
    setBusy(false)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm items-center px-4">
      <Card className="w-full">
        <h1 className="mb-1 text-lg font-semibold">CMS</h1>
        <p className="mb-5 text-sm text-gray-500 dark:text-white/50">サイトの内容を編集します。</p>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void submit()
          }}
          className="space-y-4"
        >
          <Field label="パスワード">
            <TextInput
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={setPassword}
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={busy || password.length === 0} className="w-full">
            {busy ? "確認中…" : "ログイン"}
          </Button>
        </form>
      </Card>
    </main>
  )
}
