import React from "react";
import { FaReact, FaGithub, FaPython, FaGitlab, FaNodeJs } from "react-icons/fa";
import { LuGraduationCap, LuMusic } from "react-icons/lu";
import { BiLogoGit } from "react-icons/bi";
import { FaCode } from "react-icons/fa6";
import { SiTypescript, SiDjango, SiDbt, SiSnowflake, SiVercel } from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb";
import contract_analyzer from "@/public/images/projects/contract-analyzer.png";
import claude from "@/public/ai-images/claude.jpg";
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
        "title_zh": "合同分析器：使用AI分析合同风险",
        "title_ja": "契約分析器：AIによる契約リスク分析",
        "description":
            "This is a project that analyzes contracts with AI. It is a web application that allows users to upload a contract and analyze it with AI.",
        "desc_zh": "使用AI分析合同风险的Web应用程序。它允许用户上传合同并使用AI分析合同风险并提出修改建议。",
        "desc_ja": "AIによる契約リスク分析のWebアプリケーションです。ユーザーは契約書をアップロードし、AIによって契約リスクを分析し、分析結果・提案をUIで表示。",
        "tags": ["OpenAI", "GPT-5", "AI", "LLM", "Web", "Next.js", "React", "TypeScript", "Tailwind", "Shadcn", "Vercel"],
        "imageUrl": contract_analyzer,
        "demoUrl": "https://contract-analyzer.vercel.app/"
    },
    {
        "title": "Claude 3.5 Sonnet: Anthropic's Latest AI Assistant",
        "title_zh": "Claude 3.5 Sonnet：Anthropic的最新AI助手",
        "title_ja": "Claude 3.5 Sonnet：Anthropicの最新AIアシスタント",
        "description": "Anthropic's Claude 3.5 Sonnet shows wide-ranging improvements on industry benchmarks, with particularly strong gains in agentic coding and tool use tasks. It outperforms all publicly available models on coding tasks, scoring higher than specialized systems designed for agentic coding.",
        "desc_zh": "Anthropic的Claude 3.5 Sonnet在行业基准测试中表现出广泛的改进，特别是在代理编码和工具使用任务方面取得了显著进步。在编码任务上，它的表现优于所有公开可用的模型，得分高于专为代理编码设计的专业系统。",
        "desc_ja": "AnthropicのClaude 3.5 Sonnetは業界のベンチマークで幅広い改善を示し、特にエージェンティックコーディングとツール使用タスクで大きな進歩を遂げています。コーディングタスクではすべての公開モデルを上回り、エージェンティックコーディング向けに設計された専門システムよりも高いスコアを記録しています。",
        "tags": ["Anthropic", "Claude", "AI", "Coding", "Tool Use"],
        "imageUrl": claude,
        "demoUrl": "https://www.anthropic.com/claude"
    },
    {
        "title": "Google Gemini 1.5 Pro: Breakthrough in Long-Context Understanding",
        "title_zh": "Google Gemini 1.5 Pro：长上下文理解的突破",
        "title_ja": "Google Gemini 1.5 Pro：長文脈理解の革新",
        "description": "Google's Gemini 1.5 Pro delivers dramatically enhanced performance with a breakthrough in long-context understanding across modalities. It can process large amounts of data at once, including 2 hours of video, 19 hours of audio, codebases with 60,000 lines of code, or 2,000 pages of text.",
        "desc_zh": "Google的Gemini 1.5 Pro在多模态长上下文理解方面取得了突破性进展，性能得到显著提升。它可以一次处理大量数据，包括2小时的视频、19小时的音频、60,000行代码的代码库或2,000页的文本。",
        "desc_ja": "GoogleのGemini 1.5 Proはモダリティ全体で長文脈理解の革新により劇的に性能が向上しています。2時間の動画、19時間の音声、6万行のコードベース、または2,000ページのテキストなど、大量のデータを一度に処理できます。",
        "tags": ["Google", "Gemini", "AI", "Multimodal", "Long Context"],
        "imageUrl": gemini,
        "demoUrl": "https://ai.google.dev/"
    },
    {
        "title": "Midjourney V6: The Evolution of AI Image Generation",
        "title_zh": "Midjourney V6：AI图像生成的进化",
        "title_ja": "Midjourney V6：AI画像生成の進化",
        "description": "Midjourney V6 offers more control over the style and details of generated images. It encourages longer and more detailed prompts for better results and introduces new features like upscaling and remixing. The latest version produces higher resolution images up to 2048×2048 pixels with improved text handling.",
        "desc_zh": "Midjourney V6提供了对生成图像的风格和细节的更多控制。它鼓励使用更长、更详细的提示以获得更好的结果，并引入了升级和重混等新功能。最新版本可以生成高达2048×2048像素的高分辨率图像，并改进了文本处理能力。",
        "desc_ja": "Midjourney V6は生成画像のスタイルと詳細な制御を強化しています。より良い結果を得るために長く詳細なプロンプトを推奨し、アップスケーリングやリミックスなどの新機能を導入しています。最新バージョンでは最大2048×2048ピクセルの高解像度画像を生成し、テキスト処理も改善されています。",
        "tags": ["Midjourney", "AI", "Image Generation", "Art", "Design"],
        "imageUrl": midjourney,
        "demoUrl": "https://www.midjourney.com/"
    },
    {
        "title": "DALL-E 3: OpenAI's Advanced Image Generator",
        "title_zh": "DALL-E 3：OpenAI的高级图像生成器",
        "title_ja": "DALL-E 3：OpenAIの高度画像生成器",
        "description": "DALL-E 3 follows complex prompts with more accuracy and detail than its predecessors, and is able to generate more coherent and accurate text within images. It's now integrated into ChatGPT Plus, allowing users to generate images directly from conversations.",
        "desc_zh": "DALL-E 3比其前代产品能够更准确、更详细地遵循复杂的提示，并能在图像中生成更连贯、更准确的文本。它现已集成到ChatGPT Plus中，允许用户直接从对话中生成图像。",
        "desc_ja": "DALL-E 3は前身モデルよりも複雑なプロンプトをより正確かつ詳細に処理し、画像内により一貫性のある正確なテキストを生成できます。現在はChatGPT Plusに統合され、会話から直接画像を生成することが可能になりました。",
        "tags": ["OpenAI", "DALL-E", "AI", "Image Generation", "Text-to-Image"],
        "imageUrl": dalle,
        "demoUrl": "https://openai.com/dall-e-3"
    }
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
