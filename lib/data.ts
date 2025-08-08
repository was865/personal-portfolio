import React from "react";
import { FaReact, FaGithub, FaPython, FaGitlab, FaNodeJs } from "react-icons/fa";
import { LuGraduationCap, LuMusic } from "react-icons/lu";
import { BiLogoGit } from "react-icons/bi";
import { FaCode } from "react-icons/fa6";
import { SiTypescript, SiDjango, SiDbt, SiSnowflake, SiVercel } from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb";
import contract_analyzer_content from "@/public/images/projects/contract-analyzer-content.png";
import contract_analyzer_upload from "@/public/images/projects/contract-analyzer-upload.png";
import contract_analyzer_output from "@/public/images/projects/contract-analyzer-output.png";
import employee_manager_home from "@/public/images/projects/employee-manager-home.png";
import employee_manager_card from "@/public/images/projects/employee-manager-card.png";
import employee_manager_dashboard from "@/public/images/projects/employee-manager-dashboard.png";
import employee_manager_leave from "@/public/images/projects/employee-manager-leave.png";
import employee_manager_responsive from "@/public/images/projects/employee-manager-responsive.png";
import employee_manager_schedule from "@/public/images/projects/employee-manager-schedule.png";
import gemini from "@/public/ai-images/gemini.jpg";
import midjourney from "@/public/ai-images/midjourney.jpg";
import dalle from "@/public/ai-images/dalle.jpg";

export const links = [
    {
        name: "Home",
        hash: "#home",
    },
    {
        name: "About",
        hash: "#about",
    },
    {
        name: "Projects",
        hash: "#projects",
    },
    {
        name: "Skills",
        hash: "#skills",
    },
    {
        name: "Experiences",
        hash: "#experience",
    },
] as const;

export const experiencesData = [
    {
        title: "Sunborn Corporation",
        location: "Software Engineer",
        description:
            "Working on various projects including development of consolidated accounting systems for major trading companies. Responsible for detailed design, development, testing, and production operations. Technical stack includes TypeScript, Python, SQL, React, Django, AWS, DBT, Power BI, and Snowflake databases. Successfully improved code maintainability through readable SQL and thorough DBT execution verification.",
        icon: React.createElement(FaCode),
        date: "2023 Jan - Present",
    },
    {
        title: "Otus Corporation (Part-time)",
        location: "Web Developer",
        description:
            "Side job while working full-time. Developing portal sites for gas and electricity contractors and converting core system functions to web applications. Using technologies like PHP/CakePHP, TypeScript/Next.js/Prisma. Successfully led initial sprints of a project alone, building a highly extensible project base with component development focused on reusability (Atomic design, Storybook).",
        icon: React.createElement(FaReact),
        date: "2022 Oct - Present",
    },
    {
        title: "M.S.I Corporation",
        location: "Software Engineer",
        description:
            "Developed business management systems for factory operations and created a staff location management web application from scratch that was later commercialized. Worked on full-stack development using C#, JavaScript, .Net, Azure, Express, Node.js, and databases like SQL Server, SQLite, and PostgreSQL. During this period, passed the JDLA Deep Learning for ENGINEER certification.",
        icon: React.createElement(FaCode),
        date: "2020 Jul - 2022 Oct",
    },
    {
        title: "Graduate School, Yamagata University",
        location: "Master's in Cultural Systems",
        description:
            "Completed graduate studies in the Faculty of Humanities and Social Sciences, Cultural Systems program. During this period, began working part-time at M.S.I Corporation, which led to full-time employment after graduation.",
        icon: React.createElement(LuGraduationCap),
        date: "2019 Apr - 2021 Mar",
    },
    {
        title: "Chengdu Medical College University",
        location: "Bachelor's in Rehabilitation Medicine",
        description:
            "Completed undergraduate studies in the Faculty of Clinical Medicine, Department of Rehabilitation. Also obtained Level 3 National Public Nutritionist certification in China and passed the Japanese Language Proficiency Test (JLPT N1) during this period.",
        icon: React.createElement(LuGraduationCap),
        date: "2013 Sep - 2017 Jun",
    },
]

export const experiencesDataZn = [
    {
        "title": "株式会社Sunborn",
        "location": "软件工程师",
        "description": "负责多个项目，包括为大型贸易公司开发合并会计系统。担任详细设计、开发、测试和生产运营职责。技术栈包括TypeScript、Python、SQL、React、Django、AWS、DBT、Power BI和Snowflake数据库。通过编写可读性强的SQL和彻底的DBT执行效果验证，成功提高了代码的可维护性。",
        icon: React.createElement(FaCode),
        "date": "2023年1月 - 至今"
    },
    {
        "title": "株式会社Otus（兼职）",
        "location": "Web开发工程师",
        "description": "全职工作的同时进行兼职。为燃气和电力承包商开发门户网站，并将核心系统功能转换为Web应用程序。使用PHP/CakePHP、TypeScript/Next.js/Prisma等技术。成功独自领导项目的初始冲刺阶段，构建了高度可扩展的项目基础，组件开发注重重用性（原子设计、Storybook）。",
        "icon": React.createElement(FaReact),
        "date": "2022年10月 - 至今"
    },
    {
        "title": "株式会社M.S.I",
        "location": "软件工程师",
        "description": "为工厂运营开发业务管理系统，并从零开始创建了员工位置管理Web应用程序，该应用后来实现了商业化。进行全栈开发，使用C#、JavaScript、.Net、Azure、Express、Node.js和SQL Server、SQLite、PostgreSQL等数据库。在职期间通过了JDLA Deep Learning for ENGINEER认证。",
        "icon": React.createElement(FaCode),
        "date": "2020年7月 - 2022年10月"
    },
    {
        "title": "山形大学研究生院",
        "location": "文化系统专业硕士",
        "description": "完成了人文社会科学研究科文化系统专业的研究生学习。在此期间，开始在M.S.I公司实习，毕业后正式入职。",
        "icon": React.createElement(LuGraduationCap),
        "date": "2019年4月 - 2021年3月"
    },
    {
        "title": "成都医学院大学",
        "location": "康复医学学士",
        "description": "完成了临床医学系康复学专业的本科学习。在此期间，还取得了中国三级国家公共营养师资格证书，并通过了日语能力测试（JLPT N1）。",
        "icon": React.createElement(LuGraduationCap),
        "date": "2013年9月 - 2017年6月"
    },
]

export const experiencesDataJa = [
    {
        "title": "株式会社Sunborn",
        "location": "ソフトウェアエンジニア",
        "description": "大手商社向けの連結会計システム開発など複数のプロジェクトを担当。詳細設計、開発、テスト、本番運用の責任者として活躍。技術スタックはTypeScript、Python、SQL、React、Django、AWS、DBT、Power BI、Snowflakeデータベースなど。",
        "icon": React.createElement(FaCode),
        "date": "2023年1月 - 現在"
    },
    {
        "title": "株式会社オータス（副業）",
        "location": "Webデベロッパー",
        "description": "本業と並行して副業に従事。ガス・電気契約者向けのポータルサイト開発や、基幹システム機能のWebアプリケーション化を担当。PHP/CakePHP、TypeScript/Next.js/Prismaなどの技術を活用。プロジェクト始動期のスプリントを一人で担当し、Atomic design、Storybook、jestの活用により、拡張性、メンテナンス性の高いプロジェクトのベースを構築。現在はテックリーダーとして、新規機能の設計開発、チームのナレッジ共有やコードレビューを行っている。",
        "icon": React.createElement(FaReact),
        "date": "2022年10月 - 現在"
    },
    {
        "title": "株式会社エム・エス・アイ",
        "location": "ソフトウェアエンジニア",
        "description": "工場向け業務管理システムの開発や、社員の在席状態管理Webアプリケーションをゼロから作成し、後に商品化。C#、.Net、JavaScript、Express、Node.js、Azureなどを使用し、SQL Server、SQLite、PostgreSQLなどのデータベースでフルスタック開発を担当。期間中にAIの勉強を並行して学習し、JDLA Deep Learning for ENGINEER認定を取得。",
        "icon": React.createElement(FaCode),
        "date": "2020年7月 - 2022年10月"
    },
    {
        "title": "山形大学大学院",
        "location": "人文社会科学研究科・文化システム専攻",
        "description": "人文社会科学研究科・文化システム専攻の修士課程を修了。この期間中、株式会社エム・エス・アイでインターンを始め、卒業後に正式入社する。",
        "icon": React.createElement(LuGraduationCap),
        "date": "2019年4月 - 2021年3月"
    },
    {
        "title": "成都医学院大学",
        "location": "臨床医学部リハビリテーション学科",
        "description": "臨床医学部リハビリテーション学科の学士課程を修了。この期間中、中国の国家公共栄養師（三級）資格を取得し、日本語能力試験（JLPT・N1）にも合格。",
        "icon": React.createElement(LuGraduationCap),
        "date": "2013年9月 - 2017年6月"
    },
]

export type ProjectTags = typeof projectsData[number]["tags"];

export const projectsData = [
    {
        "title": "Contract Analyzer: Analyze contracts with AI",
        "title_zh": "AI合同分析：使用AI分析合同风险并提出修改建议",
        "title_ja": "AI契約書分析：AIによる契約リスク分析と提案",
        "description":
            "This is a project that analyzes contracts with AI. It is a web application that allows users to upload a contract and analyze it with AI.",
        "desc_zh": "使用AI分析合同风险的Web应用程序。它允许用户上传合同并使用AI分析合同风险并提出修改建议。",
        "desc_ja": "AIによる契約リスク分析のWebアプリケーションです。ユーザーは契約書をアップロードし、AIによって契約リスクを分析し、分析結果・提案をUIで表示。",
        "tags": ["OpenAI", "GPT-5", "AI", "LLM",  "Prompt Engineering", "Web", "Python", "TypeScript", "Vercel"],
        "imageUrls": [
          contract_analyzer_content, 
          contract_analyzer_upload,
          contract_analyzer_output,
        ],
        "demoUrl": "#"
    },
    {
        "title": "Employee Management System: Manage employees with Goolge Calendar API",
        "title_zh": "员工管理系统：使用Google Calendar API实时查看管理员工的日程与目前状态",
        "title_ja": "従業員管理システム：Google Calendar APIによる従業員の日程と状態をリアルタイムで確認",
        "description": "This is a project that manages employees with Google Calendar API. It is a web application that allows users to manage employees with Google Calendar API and check the schedule and status of employees in real time.",
        "desc_zh": "使用Google Calendar API管理员工的Web应用程序。它允许用户管理员工并使用Google Calendar API实时查看管理员工的日程与目前状态。",
        "desc_ja": "Google Calendar APIを使用した従業員管理システムです。従業員の日程と状態をリアルタイムで確認できます。",
        "tags": ["Google", "Calendar", "API", "WebSockets", "Clerk", "Next.js", "React", "TypeScript", "Tailwind", "Shadcn", "Vercel"],
        "imageUrls": [
          employee_manager_home,
          employee_manager_schedule,
          employee_manager_card,
          employee_manager_leave,
          employee_manager_dashboard,
          employee_manager_responsive,
        ],
        "demoUrl": "#"
    },
]

export const skillsDataWithIcons = [
  { 
    id: "python",
    name: "Python", 
    icon: React.createElement(FaPython, { className: "text-xl" }), 
    desc: {
      zh: "熟悉Python编程",
      en: "Python Programming",
      ja: "Pythonプログラミング"
    } 
  },
  {
    id: "django",
    name: "Django",
    icon: React.createElement(SiDjango, { className: "text-xl" }),
    desc: {
      zh: "Django开发",
      en: "Django Development",
      ja: "Django開発"
    }
  },
  { 
    id: "web",
    name: "Web", 
    icon: React.createElement(FaCode, { className: "text-xl" }), 
    desc: {
      zh: "Web开发",
      en: "Web Development",
      ja: "Web開発"
    } 
  },
  { 
    id: "git",
    name: "Git", 
    icon: React.createElement(BiLogoGit, { className: "text-xl" }), 
    desc: {
      zh: "版本控制",
      en: "Version Control",
      ja: "バージョン管理"
    } 
  },
  { 
    id: "github",
    name: "Github", 
    icon: React.createElement(FaGithub, { className: "text-xl" }), 
    desc: {
      zh: "代码托管",
      en: "Code Hosting",
      ja: "コードホスティング"
    } 
  },
  {
    id: "gitlab",
    name: "Gitlab",
    icon: React.createElement(FaGitlab, { className: "text-xl" }),
    desc: {
      zh: "代码托管",
      en: "Code Hosting",
      ja: "コードホスティング"
    }
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: React.createElement(RiNextjsFill, { className: "text-xl" }),
    desc: {
      zh: "熟悉Next.js开发",
      en: "Familiar with Next.js Development",
      ja: "Next.js開発"
    }
  },
  {
    id: "react",
    name: "React",
    icon: React.createElement(FaReact, { className: "text-xl" }),
    desc: {
      zh: "React开发",
      en: "React Development",
      ja: "React開発"
    }
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: React.createElement(SiTypescript, { className: "text-xl" }),
    desc: {
      zh: "熟悉TypeScript",
      en: "TypeScript Development",
      ja: "TypeScript開発"
    }
  },
  {
    id: "vercel",
    name: "Vercel",
    icon: React.createElement(SiVercel, { className: "text-xl" }),
    desc: {
      zh: "Vercel部署",
      en: "Vercel Deployment",
      ja: "Vercelデプロイ"
    }
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: React.createElement(FaNodeJs, { className: "text-xl" }),
    desc: {
      zh: "Node.js开发",
      en: "Node.js Development",
      ja: "Node.js開発"
    }
  },
  {
    id: "csharp",
    name: "C sharp",
    icon: React.createElement(TbBrandCSharp, { className: "text-xl" }),
    desc: {
      zh: "C#.net 开发",
      en: "C#.net Development",
      ja: "C#.net 開発"
    }
  },
  {
    id: "dbt",
    name: "DBT",
    icon: React.createElement(SiDbt, { className: "text-xl" }),
    desc: {
      zh: "数据仓库",
      en: "Data Warehouse",
      ja: "データウェアハウス"
    }
  },
  {
    id: "snowflake",
    name: "Snowflake",
    icon: React.createElement(SiSnowflake, { className: "text-xl" }),
    desc: {
      zh: "数据仓库",
      en: "Data Warehouse",
      ja: "データウェアハウス"
    }
  }
];

export const skillsData = [
    "Innovation",
    "Organizational",
    "Leadership",
    "Responsible",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Vue2",
    "Vue3",
    "React",
    "Next",
    "Node",
    "Express",
    "Git",
    "Github",
    "Cmder",
    "CAD",
    "Multisim",
    "Proteus",
    "Keil",
    "PLC",
    "Matlab",
    "Fusion360",
    "C4D",
    "PS",
    "PR",
    "AE",
    "Airiot",
    "Painting"
] 
