export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Ansen Wang - Full Stack Developer",
  description: "Personal website of Ansen Wang",
  links: {
    github: "https://github.com/was865",
    email: "mailto:wangansen865@gmail.com",
  },
};

export const notionBlogConfig = {
  blogParentId: process.env.NEXT_PUBLIC_NOTION_BLOG_PARENT_ID,
};

