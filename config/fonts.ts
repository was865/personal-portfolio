import { Ubuntu, Oleo_Script, Inter, Source_Code_Pro } from "next/font/google";
import { Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";

export const fontUbuntu = Ubuntu({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const fontOleoScript = Oleo_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-oleo",
});

export const fontInter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontSourceCodePro = Source_Code_Pro({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

// 日本語フォント
export const fontNotoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  preload: false, // 必要に応じてロード
});

// 簡体字中国語フォント
export const fontNotoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  preload: false, // 必要に応じてロード
});
