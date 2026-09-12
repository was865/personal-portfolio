import { createElement, type ReactElement } from "react"
import type { IconType } from "react-icons"
import { BiLogoGit } from "react-icons/bi"
import {
  FaGithub,
  FaGitlab,
  FaJava,
  FaLinux,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa"
import { FaAws, FaBuilding, FaChartLine, FaCode, FaDatabase, FaRobot } from "react-icons/fa6"
import { LuBriefcase, LuCamera, LuGraduationCap, LuMusic, LuRocket } from "react-icons/lu"
import { RiNextjsFill } from "react-icons/ri"
import {
  SiAnthropic,
  SiDbt,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFigma,
  SiGithubactions,
  SiGo,
  SiJest,
  SiKubernetes,
  SiLangchain,
  SiMongodb,
  SiMysql,
  SiOpenai,
  SiPhp,
  SiPostgresql,
  SiRedis,
  SiRust,
  SiSnowflake,
  SiStorybook,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si"
import { TbBrandCSharp } from "react-icons/tb"

/**
 * CMS が名前で参照できるアイコンの許可リスト。
 *
 * コンテンツ側は `"FaCode"` のような文字列だけを持つ。React 要素を JSON に入れられないのと、
 * 任意のコンポーネントを描かせないための両方の理由による。
 * ここに無い名前は既定アイコンへ落ちる（入力ミスでサイトを落とさない）。
 * 新しいアイコンを使いたくなったら、ここへ import を 1 行足す。
 */
export const ICON_REGISTRY = {
  BiLogoGit,
  FaAws,
  FaBuilding,
  FaChartLine,
  FaCode,
  FaDatabase,
  FaGithub,
  FaGitlab,
  FaJava,
  FaLinux,
  FaNodeJs,
  FaPython,
  FaReact,
  FaRobot,
  LuBriefcase,
  LuCamera,
  LuGraduationCap,
  LuMusic,
  LuRocket,
  RiNextjsFill,
  SiAnthropic,
  SiDbt,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFigma,
  SiGithubactions,
  SiGo,
  SiJest,
  SiKubernetes,
  SiLangchain,
  SiMongodb,
  SiMysql,
  SiOpenai,
  SiPhp,
  SiPostgresql,
  SiRedis,
  SiRust,
  SiSnowflake,
  SiStorybook,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  TbBrandCSharp,
} satisfies Record<string, IconType>

export type IconName = keyof typeof ICON_REGISTRY

export const ICON_NAMES = Object.keys(ICON_REGISTRY).sort() as IconName[]

const FALLBACK: IconType = FaCode

export function isIconName(name: string): name is IconName {
  return name in ICON_REGISTRY
}

/** 名前からアイコン要素を作る。未知の名前でも落とさず既定アイコンを返す。 */
export function resolveIcon(name: string, className?: string): ReactElement {
  const Icon = isIconName(name) ? ICON_REGISTRY[name] : FALLBACK
  return createElement(Icon, className ? { className } : undefined)
}
