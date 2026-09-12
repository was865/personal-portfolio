"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import type { CollectionData, CollectionName } from "@/lib/cms/schema"

type Envelope<N extends CollectionName> = {
  etag: string | null
  data: CollectionData[N]
}

type State<N extends CollectionName> = {
  status: "loading" | "ready" | "error"
  data: CollectionData[N] | null
  etag: string | null
  dirty: boolean
  saving: boolean
  error: string | null
}

function messageFor(body: { error?: string; detail?: string; issues?: unknown[] }): string {
  switch (body.error) {
    case "unauthorized":
      return "ログインが切れています。読み直してログインし直してください。"
    case "conflict":
      return "別の場所で更新されています。「読み直す」を押してから編集し直してください。"
    case "not_configured":
      return body.detail ?? "保存先（Vercel Blob）が設定されていません。"
    case "invalid_request":
      return `入力に誤りがあります: ${JSON.stringify(body.issues ?? body.detail ?? "").slice(0, 300)}`
    default:
      return "保存に失敗しました。"
  }
}

/**
 * 1 コレクションぶんの読み込み・編集・保存をまとめて扱う。
 *
 * 編集開始時の etag を保持し、保存時に `If-Match` として送る。誰か（Claude や別端末）が
 * 先に保存していれば 409 が返り、上書きせずに読み直しを促す。
 */
export function useCollection<N extends CollectionName>(name: N) {
  const [state, setState] = useState<State<N>>({
    status: "loading",
    data: null,
    etag: null,
    dirty: false,
    saving: false,
    error: null,
  })

  // save 時に「今の状態」を確実に読むための写し（クロージャに古い state を掴ませない）
  const latest = useRef(state)
  useEffect(() => {
    latest.current = state
  }, [state])

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading", error: null }))
    try {
      const response = await fetch(`/api/admin/content/${name}`, { cache: "no-store" })
      if (response.status === 401) {
        window.location.href = "/admin/login"
        return
      }
      if (!response.ok) throw new Error(await response.text())

      const envelope = (await response.json()) as Envelope<N>
      setState({
        status: "ready",
        data: envelope.data,
        etag: envelope.etag,
        dirty: false,
        saving: false,
        error: null,
      })
    } catch (error) {
      setState((current) => ({
        ...current,
        status: "error",
        error: error instanceof Error ? error.message : "読み込みに失敗しました",
      }))
    }
  }, [name])

  useEffect(() => {
    void load()
  }, [load])

  const setData = useCallback((updater: (current: CollectionData[N]) => CollectionData[N]) => {
    setState((current) =>
      current.data ? { ...current, data: updater(current.data), dirty: true } : current,
    )
  }, [])

  const save = useCallback(async () => {
    let saved = false
    const snapshot = latest.current
    if (!snapshot.data) return false

    setState((current) => ({ ...current, saving: true, error: null }))

    try {

      const response = await fetch(`/api/admin/content/${name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(snapshot.etag ? { "If-Match": snapshot.etag } : {}),
        },
        body: JSON.stringify(snapshot.data),
      })

      if (response.status === 401) {
        window.location.href = "/admin/login"
        return false
      }

      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        setState((current) => ({ ...current, saving: false, error: messageFor(body) }))
        return false
      }

      saved = true
      setState((current) => ({
        ...current,
        data: body.data ?? current.data,
        etag: body.etag,
        dirty: false,
        saving: false,
        error: null,
      }))
    } catch (error) {
      setState((current) => ({
        ...current,
        saving: false,
        error: error instanceof Error ? error.message : "保存に失敗しました",
      }))
    }

    return saved
  }, [name])

  return { ...state, setData, save, reload: load }
}

/** 配列の要素を動かして order を振り直す。 */
export function moveItem<T extends { order: number }>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next.map((item, index) => ({ ...item, order: index }))
}
