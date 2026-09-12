"use client"

import { useRouter } from "next/navigation"

import { Button } from "./ui"

export function LogoutButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      className="min-h-9 px-3"
      onClick={async () => {
        await fetch("/api/admin/session", { method: "DELETE" })
        router.replace("/admin/login")
        router.refresh()
      }}
    >
      ログアウト
    </Button>
  )
}
