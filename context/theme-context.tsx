"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import useSound from "use-sound"

type ThemeContextType = {
  theme: string
  toggleTheme: () => void
}

type ThemeContextProviderProp = {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const ThemeContextProvider = ({ children }: ThemeContextProviderProp) => {
  const [theme, setTheme] = useState("light")
  const [playLight] = useSound("/sounds/light-on.mp3", { volume: 0.2 })
  const [playDark] = useSound("/sounds/light-off.mp3", { volume: 0.2 })

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
      playDark()
      window.localStorage.setItem("theme", "dark")
      document.documentElement.classList.add("dark")
    } else {
      setTheme("light")
      playLight()
      window.localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme")
    if (localTheme) {
      setTheme(localTheme)
      if (localTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else {
      // 如果没有本地存储的主题设置，则默认使用亮色主题
      setTheme("light")
      document.documentElement.classList.remove("dark")
    }
  }, []) // 空数组，确保只在组件挂载时执行一次

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider")
  }
  return context
}

export default ThemeContextProvider
