"use client"

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { createPortal } from "react-dom"
import Image, { type StaticImageData } from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { FiX, FiMaximize2, FiMinimize2 } from "react-icons/fi"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { fontSourceCodePro } from "@/config/fonts"
import { cn } from "@/lib/utils"

export type LightboxItem = {
  src: StaticImageData | string
  /** 何が写っているかの一行説明。空文字なら説明行を出さない。 */
  caption: string
  /** caption と別の代替テキストを使いたいとき（説明が無い写真など）。 */
  alt?: string
}

type LightboxProps = {
  items: LightboxItem[]
  index: number
  onIndexChange: (index: number) => void
  open: boolean
  onClose: () => void
  /** クロームバー左端に出す出典（プロジェクト名など）。 */
  title?: string
}

/** ビューア専用トークン。既存パレット（アクセント #e9882a）と揃えている。 */
const INK = "#0B0C0E"
const INK_SOFT = "#16181C"
const ACCENT = "#E9882A"
const MUTED = "#8A9099"

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** createPortal はサーバーでは使えないので、クライアントに載ってから描画する。 */
const noopSubscribe = () => () => {}
const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

export default function Lightbox({
  items,
  index,
  onIndexChange,
  open,
  onClose,
  title,
}: LightboxProps) {
  const [zoomed, setZoomed] = useState(false)
  // 画像ごとの実寸。index をキーにして持てば、切り替え時にリセットする副作用が要らない。
  const [naturals, setNaturals] = useState<Record<number, { w: number; h: number }>>({})
  const [stageSize, setStageSize] = useState<{ w: number; h: number } | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const labelId = useId()
  const isClient = useIsClient()

  const current = items[index]
  const count = items.length
  // 静的インポートなら実寸が最初から分かる。文字列 URL は読み込み後に確定する。
  const staticSize =
    current && typeof current.src === "object"
      ? { w: current.src.width, h: current.src.height }
      : null
  const natural = naturals[index] ?? staticSize
  const pad = useMemo(() => String(count).length, [count])

  const captureNatural = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth: w, naturalHeight: h } = e.currentTarget
      if (!w || !h) return
      setNaturals((prev) => (prev[index]?.w === w ? prev : { ...prev, [index]: { w, h } }))
    },
    [index],
  )

  // 原寸がステージより小さい画像は、100% にしても大きくならない。
  // そういう画像では倍率トグルを出さない（押しても何も起きない操作を置かない）。
  const canZoom =
    !!natural &&
    !!stageSize &&
    (natural.w > stageSize.w - 24 || natural.h > stageSize.h - 24)

  /** 画像を切り替える唯一の入口。倍率とスクロール位置もここで戻す。 */
  const select = useCallback(
    (next: number) => {
      setZoomed(false)
      if (stageRef.current) {
        stageRef.current.scrollLeft = 0
        stageRef.current.scrollTop = 0
      }
      onIndexChange(next)
    },
    [onIndexChange],
  )

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return
      select((index + delta + count) % count)
    },
    [count, index, select],
  )

  // 開いたときのフォーカス退避と、閉じたときの復帰。
  useEffect(() => {
    if (!open) return
    openerRef.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    return () => openerRef.current?.focus?.()
  }, [open])

  // 背後のスクロールを止める。
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // キーボード操作とフォーカストラップ。
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose()
      if (e.key === "ArrowRight") return go(1)
      if (e.key === "ArrowLeft") return go(-1)
      if (e.key === "Home") return select(0)
      if (e.key === "End") return select(count - 1)
      if (e.key === " " || e.key === "Enter") {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === "BUTTON" || !canZoom) return
        e.preventDefault()
        return setZoomed((z) => !z)
      }
      if (e.key !== "Tab") return
      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, go, onClose, select, count, canZoom])

  // ステージの実寸を測る。倍率トグルを出すかどうかの判定に使う。
  useEffect(() => {
    const stage = stageRef.current
    if (!open || !stage) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setStageSize({ w: Math.round(width), h: Math.round(height) })
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [open])

  // 100% 表示のときだけ、ドラッグでパンできるようにする。
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !zoomed) return
    let dragging = false
    let startX = 0
    let startY = 0
    let startLeft = 0
    let startTop = 0
    const down = (e: PointerEvent) => {
      dragging = true
      startX = e.clientX
      startY = e.clientY
      startLeft = stage.scrollLeft
      startTop = stage.scrollTop
      stage.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      stage.scrollLeft = startLeft - (e.clientX - startX)
      stage.scrollTop = startTop - (e.clientY - startY)
    }
    const up = (e: PointerEvent) => {
      dragging = false
      stage.releasePointerCapture?.(e.pointerId)
    }
    stage.addEventListener("pointerdown", down)
    stage.addEventListener("pointermove", move)
    stage.addEventListener("pointerup", up)
    stage.addEventListener("pointercancel", up)
    return () => {
      stage.removeEventListener("pointerdown", down)
      stage.removeEventListener("pointermove", move)
      stage.removeEventListener("pointerup", up)
      stage.removeEventListener("pointercancel", up)
    }
  }, [zoomed])

  if (!isClient || !current) return null

  const duration = reduceMotion ? 0 : 0.18

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          // ヘッダー(z-999)とテーマ/言語ウィジェットより必ず上に出す。
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ backgroundColor: INK }}
          onClick={onClose}
        >
          <div
            ref={panelRef}
            // クロームバーの左右余白。セーフエリアと足し合わせるので変数にしておく。
            className="flex h-full w-full flex-col [--lb-gutter:0.75rem] sm:[--lb-gutter:1.25rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* クロームバー：出典・枚数・表示倍率・閉じる */}
            <header
              className={cn(
                "flex shrink-0 items-center gap-3 border-b pb-2.5",
                // iOS のホーム画面から開くと viewport-fit=cover でバーがステータスバーの
                // 下に潜り、閉じるボタンが押せなくなる。セーフエリアぶん中身を下げる。
                // 背景は画面の端まで伸ばしたままにして、時計や電池の背当てにする。
                // さらに --nav-top-gap ぶん下げる。iOS 26 の状態バーはすりガラスで、
                // 安全域の少し下までぼかしが滲み、ここの文字とボタンが霞むため。
                "pt-[calc(0.625rem+var(--safe-top)+var(--nav-top-gap))]",
                "pl-[calc(var(--lb-gutter)+var(--safe-left))]",
                "pr-[calc(var(--lb-gutter)+var(--safe-right))]",
              )}
              style={{ backgroundColor: INK_SOFT, borderColor: "rgba(255,255,255,0.07)" }}
            >
              <h2
                id={labelId}
                className="min-w-0 flex-1 truncate text-[13px] text-white/80"
              >
                {title}
              </h2>

              <span
                className={cn(
                  fontSourceCodePro.className,
                  "shrink-0 text-[12px] tabular-nums tracking-[0.14em]",
                )}
                style={{ color: MUTED }}
              >
                {String(index + 1).padStart(pad, "0")} / {count}
              </span>

              {canZoom && (
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-pressed={zoomed}
                className={cn(
                  fontSourceCodePro.className,
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] tracking-[0.14em] transition",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
                style={{
                  color: zoomed ? INK : "rgba(255,255,255,0.75)",
                  backgroundColor: zoomed ? ACCENT : "rgba(255,255,255,0.07)",
                  outlineColor: ACCENT,
                }}
              >
                {zoomed ? <FiMinimize2 className="h-3.5 w-3.5" /> : <FiMaximize2 className="h-3.5 w-3.5" />}
                {zoomed ? "100%" : "FIT"}
              </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="ビューアを閉じる"
                className="shrink-0 rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: ACCENT }}
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            {/* ステージ */}
            {/* 横向きのとき、写真がノッチや画面の丸角に食われないようにする。
                矢印は絶対配置でこの padding の影響を受けないので、別途あちらで詰める。 */}
            <div className="relative min-h-0 flex-1 pl-[var(--safe-left)] pr-[var(--safe-right)]">
              <div
                ref={stageRef}
                className={cn(
                  "h-full w-full",
                  zoomed
                    ? "overflow-auto cursor-grab active:cursor-grabbing"
                    : cn("overflow-hidden", canZoom && "cursor-zoom-in"),
                )}
                onClick={() => canZoom && setZoomed((z) => !z)}
              >
                {zoomed && natural ? (
                  <Image
                    src={current.src}
                    alt={current.alt ?? current.caption}
                    width={natural.w}
                    height={natural.h}
                    quality={95}
                    priority
                    unoptimized
                    className="max-w-none"
                    onLoad={captureNatural}
                  />
                ) : natural ? (
                  // 原寸（width/height）を与えたうえで max-* で縮めるだけにする。
                  // こうすると小さい元画像を引き伸ばさず、ぼやけない。
                  <div className="flex h-full w-full items-center justify-center p-2 sm:p-6">
                    <Image
                      key={index}
                      src={current.src}
                      alt={current.alt ?? current.caption}
                      width={natural.w}
                      height={natural.h}
                      priority
                      // 拡大表示では再エンコードを挟まず原本をそのまま出す。
                      unoptimized
                      className="h-auto max-h-full w-auto max-w-full object-contain"
                      onLoad={captureNatural}
                    />
                  </div>
                ) : (
                  // 実寸が分かるまでの初回だけ fill で置く（読み込み後に上の分岐へ移る）。
                  <div className="relative h-full w-full p-2 sm:p-6">
                    <Image
                      key={index}
                      src={current.src}
                      alt={current.alt ?? current.caption}
                      fill
                      sizes="100vw"
                      priority
                      unoptimized
                      className="object-contain"
                      onLoad={captureNatural}
                    />
                  </div>
                )}
              </div>

              {count > 1 && (
                <>
                  <NavButton side="left" onClick={() => go(-1)} />
                  <NavButton side="right" onClick={() => go(1)} />
                </>
              )}
            </div>

            {/* キャプションとフィルムストリップ */}
            <footer
              className={cn(
                "shrink-0 border-t pt-2.5",
                // フィルムストリップがホームインジケータに隠れないようにする。
                "pb-[calc(0.75rem+var(--safe-bottom))]",
                "pl-[calc(var(--lb-gutter)+var(--safe-left))]",
                "pr-[calc(var(--lb-gutter)+var(--safe-right))]",
              )}
              style={{ backgroundColor: INK_SOFT, borderColor: "rgba(255,255,255,0.07)" }}
            >
              {current.caption && (
                <p className="mb-2.5 text-[13px] leading-snug text-white/85">{current.caption}</p>
              )}

              {count > 1 && (
                <ul className="flex gap-2 overflow-x-auto pb-1">
                  {items.map((item, i) => (
                    <li key={i} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => select(i)}
                        aria-label={`${i + 1}枚目：${item.alt ?? item.caption}`}
                        aria-current={i === index}
                        className="relative block h-12 w-[5.25rem] overflow-hidden rounded transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:h-14 sm:w-[6.5rem]"
                        style={{
                          outlineColor: ACCENT,
                          boxShadow:
                            i === index
                              ? `0 0 0 2px ${ACCENT}`
                              : "inset 0 0 0 1px rgba(255,255,255,0.12)",
                          opacity: i === index ? 1 : 0.5,
                        }}
                      >
                        <Image
                          src={item.src}
                          alt=""
                          fill
                          sizes="120px"
                          quality={75}
                          className="object-cover object-left-top"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <p
                className={cn(
                  fontSourceCodePro.className,
                  "mt-1.5 hidden text-[10px] tracking-[0.12em] sm:block",
                )}
                style={{ color: MUTED }}
              >
                ← → 移動{canZoom && " · SPACE 拡大"} · ESC 閉じる
              </p>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? HiChevronLeft : HiChevronRight
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={side === "left" ? "前の画像" : "次の画像"}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2.5 text-white/85 backdrop-blur-sm transition",
        "hover:bg-black/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2",
        // 横向きだとこちら側がノッチや丸角に掛かる。セーフエリアぶん内へ寄せる。
        side === "left"
          ? "left-[calc(0.5rem+var(--safe-left))] sm:left-[calc(1rem+var(--safe-left))]"
          : "right-[calc(0.5rem+var(--safe-right))] sm:right-[calc(1rem+var(--safe-right))]",
      )}
      style={{ outlineColor: ACCENT }}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  )
}
