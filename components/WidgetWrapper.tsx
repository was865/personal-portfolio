"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/** 下へこれだけ動いたら隠す。指の細かい揺れで出入りさせない。 */
const HIDE_AFTER = 12
/** 上へ戻す側はしきい値を大きく取る。画像の遅延読み込みでレイアウトが伸びると
 *  ブラウザがスクロール位置を数十px巻き戻すので、それを「戻る操作」と取り違えて
 *  読んでいる最中に出てきてしまう。 */
const SHOW_AFTER = 32
/** 画面のこの位置より上では常に出す。読み始める前に消えていると気付けない。 */
const ALWAYS_SHOWN_UNTIL = 96

export default function WidgetWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // 下へ読み進めている間だけ隠す。戻る操作（上スクロール）で必ず出る。
  // 「止まったら出す」にはしない。止まっている時間は読んでいる時間なので、
  // いちばん出したくないときに文字の上へ戻ってくることになる。
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        const delta = y - lastY.current

        // iOS のバウンスで y は負にもなる。上端付近はまとめて「出す」側に倒す。
        if (y <= ALWAYS_SHOWN_UNTIL) {
          lastY.current = y
          setHidden(false)
          return
        }

        if (delta > HIDE_AFTER) {
          lastY.current = y
          setHidden(true)
        } else if (delta < -SHOW_AFTER) {
          lastY.current = y
          setHidden(false)
        }
        // どちらにも届かない間は lastY を動かさない。ゆっくり戻す操作でも、
        // 累計で SHOW_AFTER に届いた時点で出る。
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      // キーボードで辿り着いたときは、隠れていても必ず出す。
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "fixed z-[100] flex flex-col items-center justify-between rounded-lg border border-white/40 bg-white/70 p-1 shadow-2xl backdrop-blur-[0.5rem] dark:border-slate-700 dark:bg-gray-950/50",
        // 横向きだと右端が切り欠きや丸角に掛かる。セーフエリアと大きい方を取る。
        "bottom-[calc(var(--safe-bottom)+1.25rem)] right-[max(0.75rem,var(--safe-right))]",
        "sm:bottom-[calc(var(--safe-bottom)+3rem)] sm:right-[max(3rem,var(--safe-right))]",
        // Tailwind v4 の translate-y-* は transform ではなく translate プロパティを
        // 書く。transform を並べても位置は補間されず、カクッと飛ぶ。
        "transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none",
        // 隠れている間は下の文章を触れるようにする。
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100",
      )}
    >
      {children}
    </div>
  )
}
