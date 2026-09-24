"use client"

import { motion, useReducedMotion } from "motion/react"
import React, { useMemo, useState, useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import Lightbox, { type LightboxItem } from "@/components/Lightbox"
import { fontSourceCodePro } from "@/config/fonts"
import { cn } from "@/lib/utils"

const CARD_OFFSET = 4
const ROTATION_FACTOR = 6
/** これ以上動かしたらドラッグ。以内ならクリックとして扱い、拡大表示を開く。 */
const CLICK_SLOP_PX = 6

interface Card {
  id: number
  imageUrl: string
  rotation: number
}

interface CardStackProps {
  photos: string[]
}

/** index から決まる傾き。Math.random と違いサーバーとクライアントで一致する。 */
function rotationFor(index: number) {
  const pseudo = ((Math.sin(index * 12.9898) * 43758.5453) % 1 + 1) % 1
  return (index % 2 === 0 ? 1 : -1) * ROTATION_FACTOR * pseudo
}

const CardStack: React.FC<CardStackProps> = ({ photos }) => {
  const [openAt, setOpenAt] = useState<number | null>(null)
  // 表示順だけを state に持つ。写真そのものは props から導出する。
  const [order, setOrder] = useState<number[]>(() => photos.map((_, i) => i))
  const [photoCount, setPhotoCount] = useState(photos.length)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const reduceMotion = useReducedMotion()
  const t = useTranslations("AboutSection")

  // props が差し替わったら順序を組み直す（レンダー中の調整。副作用にはしない）。
  if (photoCount !== photos.length) {
    setPhotoCount(photos.length)
    setOrder(photos.map((_, i) => i))
  }

  const cards: Card[] = useMemo(
    () =>
      order
        .filter((i) => i < photos.length)
        .map((i) => ({ id: i, imageUrl: photos[i], rotation: rotationFor(i) })),
    [order, photos],
  )

  const moveToEnd = (from: number) => {
    setOrder((prev) => {
      const next = [...prev]
      next.push(next.splice(from, 1)[0])
      return next
    })
  }

  // 扇全体の高さの半分。これを足すと重なりの中心がタイル中心に来る。
  const fanOffset = ((cards.length - 1) * CARD_OFFSET) / 2

  // ビューアは「今スタックに見えている順」で並べる。
  const items: LightboxItem[] = useMemo(
    () =>
      cards.map((card, i) => ({
        src: card.imageUrl,
        // 説明のない私的な写真なので、キャプション行は出さず alt だけ持たせる。
        caption: "",
        alt: t("photo_caption", { n: i + 1 }),
      })),
    [cards, t],
  )

  return (
    <>
      <div className="group/stack relative h-full w-full">
        <ul className="flex h-full w-full items-center justify-center">
          {cards.map((card, index) => (
            <motion.li
              key={card.id}
              // 上へ重ねるだけだと扇が上に伸びて中心がずれる。半分ぶん押し戻す。
              animate={{ y: fanOffset - index * CARD_OFFSET, rotate: card.rotation }}
              // rgl-no-drag は写真そのものだけに付ける。タイルの余白は
              // グリッドのドラッグ用に残しておく。
              // 幅は li に持たせる。img 側に % 幅を置くと li が親幅まで広がり、
              // 中の画像が左寄せのまま回転して中心がずれる。
              className="rgl-no-drag absolute w-[min(86%,28rem)] origin-center list-none rounded-lg"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              initial={{ rotate: card.rotation }}
              style={{ zIndex: cards.length - index }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 50 }}
              onDragEnd={() => moveToEnd(index)}
              // react-grid-layout（react-draggable）は mouse/touch を見ているので、
              // pointer だけ止めてもグリッドごと動いてしまう。両方を止める。
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                e.stopPropagation()
                pointerStart.current = { x: e.clientX, y: e.clientY }
              }}
              onPointerUp={(e) => {
                const start = pointerStart.current
                pointerStart.current = null
                if (!start) return
                const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y)
                if (moved <= CLICK_SLOP_PX) setOpenAt(index)
              }}
            >
              <button
                type="button"
                // クリック判定は onPointerUp 側で行う。ここはキーボード操作の受け口。
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setOpenAt(index)
                  }
                }}
                aria-label={t("photo_open", { n: index + 1 })}
                tabIndex={index === 0 ? 0 : -1}
                className="block cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9882a]"
              >
                <Image
                  alt={t("photo_caption", { n: index + 1 })}
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]"
                  height={480}
                  // 先頭のカードは初期表示の LCP になるので遅延読み込みしない。
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={80}
                  src={card.imageUrl}
                  width={640}
                  draggable={false}
                />
              </button>
            </motion.li>
          ))}
        </ul>

        {/* 何枚あって、何ができるのか。ホバーで前に出す。 */}
        <div
          className={cn(
            fontSourceCodePro.className,
            // ホバー前提のヒントなので、タッチ環境（sm 未満）では出さない。
            // 折り返すとピルの形が崩れるので一行に固定する。
            "pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 sm:block",
            "max-w-[calc(100%-1rem)] truncate whitespace-nowrap rounded-full",
            "bg-black/65 px-3 py-1.5 text-[10px] leading-none tracking-[0.06em] text-white/90 backdrop-blur-sm",
            "opacity-0 transition group-hover/stack:opacity-100",
          )}
        >
          {t("photo_hint", { count: cards.length })}
        </div>
      </div>

      <Lightbox
        items={items}
        index={openAt ?? 0}
        onIndexChange={setOpenAt}
        open={openAt !== null}
        onClose={() => setOpenAt(null)}
        title={t("photos_title")}
      />
    </>
  )
}

export default CardStack
