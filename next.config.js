const createNextIntlPlugin = require("next-intl/plugin")
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [70, 75, 80, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      // ブログのカバー画像。Notion のプロキシは 302 を返すだけなので直接読む。
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "s.baoyu.io",
      },
    ],
  },
}

module.exports = withPWA(withNextIntl(nextConfig))
