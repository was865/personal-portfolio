"use client"

import { useTheme } from "@/context/theme-context"
import React from "react"
import { BsMoon, BsSun } from "react-icons/bs"
export default function ThemeSwitch() {


  const { theme, toggleTheme } = useTheme()
  return (
    <button
      // 押せる大きさは他の要素と同じ 44px に揃える（iOS の下限でもある）。
      className="flex h-11 w-11 items-center justify-center transition-all hover:scale-[1.15] active:scale-105"
      onClick={toggleTheme}
    >
      <span className="sr-only">change dark mode</span>
      {theme === "light" ? <BsSun /> : <BsMoon />}
    </button>
  )
}
