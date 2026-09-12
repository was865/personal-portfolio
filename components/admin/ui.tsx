"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { ICON_NAMES } from "@/config/icon-registry"
import { LOCALES, type L, type Locale } from "@/lib/cms/schema"

/* ------------------------------------------------------------------ *
 * 編集中の言語
 *
 * 3 言語ぶんの入力欄を同時に並べるとスマホで縦に伸びすぎる。画面の上で
 * 言語を 1 つ選び、多言語フィールドはその言語だけを出す。
 * ------------------------------------------------------------------ */

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({
  locale: "ja",
  setLocale: () => {},
})

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ja")
  return <LocaleContext value={{ locale, setLocale }}>{children}</LocaleContext>
}

export function useAdminLocale() {
  return useContext(LocaleContext)
}

const LOCALE_LABELS: Record<Locale, string> = { ja: "日本語", zh: "中文", en: "English" }

export function LocaleTabs() {
  const { locale, setLocale } = useAdminLocale()

  return (
    <div className="flex gap-1 rounded-full bg-gray-200/70 p-1 dark:bg-white/10">
      {LOCALES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className={cn(
            "min-h-9 flex-1 rounded-full px-3 text-sm transition",
            value === locale
              ? "bg-white font-semibold shadow-sm dark:bg-white/20"
              : "text-gray-600 dark:text-white/60",
          )}
        >
          {LOCALE_LABELS[value]}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 部品
 * ------------------------------------------------------------------ */

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ")
}

const INPUT_CLASS =
  "w-full min-h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-gray-900 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/60"

export function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "default" | "primary" | "danger" | "ghost"
  disabled?: boolean
  className?: string
}) {
  const styles = {
    default:
      "border border-gray-300 bg-white hover:bg-gray-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10",
    primary: "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-gray-900",
    danger: "border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-white/10",
  }[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 text-sm font-medium transition disabled:opacity-40",
        styles,
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium tracking-wide text-gray-500 dark:text-white/50">
        {label}
        {hint && <span className="ml-2 font-normal text-gray-400 dark:text-white/30">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  multiline,
  rows = 4,
  type = "text",
  autoComplete,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
  type?: "text" | "password"
  autoComplete?: string
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(INPUT_CLASS, "leading-relaxed")}
      />
    )
  }

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
      className={INPUT_CLASS}
    />
  )
}

/** 選択中の言語だけを編集する欄。未入力の言語は見出しの点で分かるようにする。 */
export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
  rows,
  placeholder,
}: {
  label: string
  value: L<string>
  onChange: (value: L<string>) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
}) {
  const { locale } = useAdminLocale()

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-gray-500 dark:text-white/50">
          {label}
        </span>
        <span className="flex gap-1">
          {LOCALES.map((code) => (
            <span
              key={code}
              title={`${code}: ${value[code] ? "入力済み" : "未入力"}`}
              className={cn(
                "rounded px-1 text-[10px] uppercase",
                value[code]?.trim()
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-gray-200 text-gray-400 dark:bg-white/10 dark:text-white/30",
              )}
            >
              {code}
            </span>
          ))}
        </span>
      </div>
      <TextInput
        value={value[locale] ?? ""}
        onChange={(next) => onChange({ ...value, [locale]: next })}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  )
}

export function IconSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <select
      value={ICON_NAMES.includes(value as (typeof ICON_NAMES)[number]) ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      className={INPUT_CLASS}
    >
      <option value="">（選択する）</option>
      {ICON_NAMES.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  )
}

/** 指で押せる並べ替え。ドラッグはスマホで誤爆しやすいので使わない。 */
export function MoveButtons({
  index,
  count,
  onMove,
}: {
  index: number
  count: number
  onMove: (from: number, to: number) => void
}) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="min-h-9 w-10 px-0"
      >
        ↑
      </Button>
      <Button
        variant="ghost"
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        className="min-h-9 w-10 px-0"
      >
        ↓
      </Button>
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** 画面下に固定する保存バー。スクロール位置にかかわらず保存できる。 */
export function SaveBar({
  dirty,
  saving,
  error,
  onSave,
  onReload,
}: {
  dirty: boolean
  saving: boolean
  error: string | null
  onSave: () => void
  onReload: () => void
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-gray-200 bg-gray-50/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#0b0c0e]/95">
      {error && (
        <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button variant="primary" disabled={!dirty || saving} onClick={onSave}>
          {saving ? "保存中…" : "保存して公開"}
        </Button>
        <Button variant="ghost" onClick={onReload} disabled={saving}>
          読み直す
        </Button>
        <span className="text-xs text-gray-500 dark:text-white/40">
          {dirty ? "未保存の変更があります" : "保存済み"}
        </span>
      </div>
    </div>
  )
}
