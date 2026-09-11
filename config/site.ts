export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Ansen Wang - Full Stack Developer",
  description: "Personal website of Ansen Wang",
  links: {
    github: "https://github.com/was865",
    email: "mailto:wangansen865@gmail.com",
    // 取得した資格の検証ページ。About のバッジとヒーローの両方から参照する。
    openBadge:
      "https://www.openbadge-global.com/api/v1.0/openBadge/v2/Wallet/Public/GetAssertionShare/SU02RC9nakE3Y3dNeWVOMTMxUEhnZz09",
  },
};

export const notionBlogConfig = {
  blogParentId: process.env.NEXT_PUBLIC_NOTION_BLOG_PARENT_ID,
};

