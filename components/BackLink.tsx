import Link from "next/link"
import { HiChevronLeft } from "react-icons/hi"
import { fontSourceCodePro } from "@/config/fonts"
import { cn } from "@/lib/utils"

/**
 * 各ページ左上の「戻る」。
 *
 * 一覧と詳細で別々に書いていたら padding と行高がずれ、ページを移るたびに
 * リンクが動いて見えた。位置がずれないよう、見た目はここに一本化する。
 * leading-4 を明示しているのは、日本語・中国語では body の line-height が
 * 1.65 になり、英語ページと高さが変わってしまうため。
 */
export default function BackLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        fontSourceCodePro.className,
        // 文字は小さいままでいいが、押せる高さは 44px 欲しい。
        // 上下の padding を負の margin で打ち消すので見た目の位置は動かない。
        "inline-flex w-fit items-center gap-1 py-3.5 -my-3.5",
        "text-[11px] leading-4 tracking-[0.14em]",
        "text-gray-500 transition hover:text-[#e9882a]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9882a]",
        "dark:text-white/50 dark:hover:text-yellow",
      )}
    >
      <HiChevronLeft className="h-4 w-4" />
      {children}
    </Link>
  )
}
