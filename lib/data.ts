import React from "react";
import type { StaticImageData } from "next/image";
import { FaReact, FaGithub, FaPython, FaGitlab, FaNodeJs } from "react-icons/fa";
import { LuGraduationCap, LuMusic } from "react-icons/lu";
import { BiLogoGit } from "react-icons/bi";
import { FaCode, FaAws, FaDatabase, FaRobot } from "react-icons/fa6";
import {
  SiTypescript,
  SiDjango,
  SiDbt,
  SiSnowflake,
  SiVercel,
  SiFastapi,
  SiDocker,
  SiPostgresql,
  SiLangchain,
  SiOpenai,
  SiAnthropic,
  SiTailwindcss,
} from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb";
import arag_answer_multihop from "@/public/images/projects/arag-answer-multihop.webp";
import arag_agent_steps from "@/public/images/projects/arag-agent-steps.webp";
import arag_image_understanding from "@/public/images/projects/arag-image-understanding.webp";
import arag_scanned_form from "@/public/images/projects/arag-scanned-form.webp";
import arag_table_extraction from "@/public/images/projects/arag-table-extraction.webp";
import arag_sources_panel from "@/public/images/projects/arag-sources-panel.webp";
import arag_agents_home from "@/public/images/projects/arag-agents-home.webp";
import arag_agent_delivery_trace from "@/public/images/projects/arag-agent-delivery-trace.webp";
import arag_agent_delivery_writeback from "@/public/images/projects/arag-agent-delivery-writeback.webp";
import arag_agent_scheduling from "@/public/images/projects/arag-agent-scheduling.webp";
import arag_document_library from "@/public/images/projects/arag-document-library.webp";
import contract_analyzer_content from "@/public/images/projects/contract-analyzer-content.webp";
import contract_analyzer_upload from "@/public/images/projects/contract-analyzer-upload.webp";
import contract_analyzer_output from "@/public/images/projects/contract-analyzer-output.webp";
import employee_manager_home from "@/public/images/projects/employee-manager-home.webp";
import employee_manager_card from "@/public/images/projects/employee-manager-card.webp";
import employee_manager_dashboard from "@/public/images/projects/employee-manager-dashboard.webp";
import employee_manager_leave from "@/public/images/projects/employee-manager-leave.webp";
import employee_manager_responsive from "@/public/images/projects/employee-manager-responsive.webp";
import employee_manager_schedule from "@/public/images/projects/employee-manager-schedule.webp";
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
        title: "Tata Consultancy Services Japan",
        location: "Technical Lead / Fullstack Engineer",
        description:
            "IT services and consulting company, a joint venture between the Tata Group and Mitsubishi Corporation. As a technical lead, I drive the modernization of core business systems for large B2B enterprises — requirement analysis, technical validation, architecture definition, design and development — working alongside client business teams under a spec-driven development (SDD) process. Tech stack: React, Next.js, Node.js and AWS (EC2, S3, Lambda).",
        icon: React.createElement(FaCode),
        date: "2026 Aug - Present",
    },
    {
        title: "Sunborn Corporation",
        location: "Software Engineer",
        description:
            "Working on various projects including development of consolidated accounting systems for major trading companies. Responsible for detailed design, development, testing, and production operations. Technical stack includes TypeScript, Python, SQL, React, Django, AWS, DBT, Power BI, and Snowflake databases. Successfully improved code maintainability through readable SQL and thorough DBT execution verification.",
        icon: React.createElement(FaCode),
        date: "2023 Jan - 2026 Jul",
    },
    {
        title: "Otus Corporation (Part-time)",
        location: "Web Developer",
        description:
            "Side job while working full-time. Developing portal sites for gas and electricity contractors and converting core system functions to web applications. Using technologies like PHP/CakePHP, TypeScript/Next.js/Prisma. Successfully led initial sprints of a project alone, building a highly extensible project base with component development focused on reusability (Atomic design, Storybook). Later served as tech lead for the India offshore team — designing and developing new features, handing over specifications, reviewing code, and sharing knowledge across the team.",
        icon: React.createElement(FaReact),
        date: "2022 Oct - 2026 Mar",
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
        "title": "日本塔塔咨询服务有限公司（TCS Japan）",
        "location": "技术负责人 / 全栈工程师",
        "description": "塔塔集团与三菱商事合资的IT服务与咨询公司。作为技术负责人（Technical Lead），负责大型toB企业基干系统的现代化改造（Modernization）。与客户业务团队协作，以规范驱动开发（SDD）推进业务需求分析、技术验证、架构制定与设计开发。技术栈为React、Next.js、Node.js与AWS（EC2、S3、Lambda）。",
        icon: React.createElement(FaCode),
        "date": "2026年8月 - 至今"
    },
    {
        "title": "株式会社Sunborn",
        "location": "软件工程师",
        "description": "负责多个项目，包括为大型贸易公司开发合并会计系统。担任详细设计、开发、测试和生产运营职责。技术栈包括TypeScript、Python、SQL、React、Django、AWS、DBT、Power BI和Snowflake数据库。通过编写可读性强的SQL和彻底的DBT执行效果验证，成功提高了代码的可维护性。",
        icon: React.createElement(FaCode),
        "date": "2023年1月 - 2026年7月"
    },
    {
        "title": "株式会社Otus（兼职）",
        "location": "Web开发工程师",
        "description": "全职工作的同时进行兼职。为燃气和电力承包商开发门户网站，并将核心系统功能转换为Web应用程序。使用PHP/CakePHP、TypeScript/Next.js/Prisma等技术。成功独自领导项目的初始冲刺阶段，构建了高度可扩展的项目基础，组件开发注重重用性（原子设计、Storybook）。后期作为印度离岸（offshore）团队的技术负责人（Tech Lead），负责新功能的设计开发、规格交接与代码评审，以及团队知识共享。",
        "icon": React.createElement(FaReact),
        "date": "2022年10月 - 2026年3月"
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
        "title": "日本タタ・コンサルタンシー・サービシズ株式会社",
        "location": "テクニカルリード / フルスタックエンジニア",
        "description": "タタ・グループと三菱商事の合弁によるITサービス・コンサルティング企業。テクニカルリードとして、大手toB企業の基幹システムのモダナイゼーションを担当。顧客のビジネスチームと協働しながら、ビジネス要件分析・技術検証・アーキテクチャ策定から設計・開発までをスペック駆動開発（SDD）で推進している。技術スタックは React / Next.js / Node.js / AWS（EC2、S3、Lambda）。",
        "icon": React.createElement(FaCode),
        "date": "2026年8月 - 現在"
    },
    {
        "title": "株式会社Sunborn",
        "location": "ソフトウェアエンジニア",
        "description": "大手商社向けの連結会計システム開発など複数のプロジェクトを担当。詳細設計、開発、テスト、本番運用の責任者として活躍。技術スタックはTypeScript、Python、SQL、React、Django、AWS、DBT、Power BI、Snowflakeデータベースなど。",
        "icon": React.createElement(FaCode),
        "date": "2023年1月 - 2026年7月"
    },
    {
        "title": "株式会社オータス（副業）",
        "location": "Webデベロッパー",
        "description": "本業と並行して副業に従事。ガス・電気契約者向けのポータルサイト開発や、基幹システム機能のWebアプリケーション化を担当。PHP/CakePHP、TypeScript/Next.js/Prismaなどの技術を活用。プロジェクト始動期のスプリントを一人で担当し、Atomic design、Storybook、jestの活用により、拡張性、メンテナンス性の高いプロジェクトのベースを構築。後半はインドのオフショアチームのテックリードとして、新規機能の設計開発、仕様共有・コードレビュー、チームのナレッジ共有を担当した。",
        "icon": React.createElement(FaReact),
        "date": "2022年10月 - 2026年3月"
    },
    {
        "title": "株式会社エム・エス・アイ",
        "location": "ソフトウェアエンジニア",
        "description": "工場向け業務管理システムの開発を担当。また、社員の在席状態管理Webアプリケーションをゼロから開発し、後に自社製品として商品化された。C#、.Net、JavaScript、Express、Node.js、Azureなどを使用し、SQL Server、SQLite、PostgreSQLなどのデータベースでフルスタック開発を担当。業務と並行してAI分野の学習にも取り組み、JDLA Deep Learning for ENGINEER認定を取得した。",
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

/** 1枚のスクリーンショットと、それが何を示しているかの一行説明。
 *  caption はギャラリーのフィルムストリップと alt の両方に使う（ロケール別）。 */
export type ProjectShot = {
    src: StaticImageData;
    caption: { en: string; ja: string; zh: string };
};

export type ProjectTags = typeof projectsData[number]["tags"];

export const projectsData = [
    {
        "slug": "arag",
        // 事例の骨格。問題と判断は既存の説明文から要約したもの。
        // role と result は本人しか書けないので空のまま。空欄は描画しない。
        "caseStudy": {
                  "problem": {
                            "zh": "企业知识散在盖章扫描件、手写批注、流程图照片和多页 PDF 里，关键词检索找不到，跨文档的问题只能人工翻。",
                            "ja": "社内の知識が押印スキャン・手書き注記・フロー図の写真・複数ページPDFに散らばり、キーワード検索では届かず、文書をまたぐ問いは人手で追うしかなかった。",
                            "en": "Company knowledge sits in stamped scans, handwritten notes, flowchart photos and multi-page PDFs. Keyword search misses it, and cross-document questions have to be traced by hand."
                  },
                  "decisions": {
                            "zh": "MinerU 做版面解析，BGE-M3 向量配 Qdrant 混合检索（RRF → rerank → 邻近扩展）。Agent 循环在证据不足时自动重新检索，所以多跳问题能一次跨多份文档得出结论。",
                            "ja": "MinerU でレイアウト解析、BGE-M3 埋め込みと Qdrant のハイブリッド検索（RRF → rerank → 近傍拡張）。根拠不足をエージェントループが検知して再検索するので、多ホップの問いも一度に解ける。",
                            "en": "MinerU for layout parsing, BGE-M3 embeddings with Qdrant hybrid search (RRF → rerank → neighbour expansion). The agent loop re-queries when evidence falls short, so multi-hop questions resolve in one pass."
                  },
                  "role": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  },
                  "result": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  }
        },
        "title": "ARag: Agentic RAG for enterprise knowledge",
        "title_zh": "ARag：企业知识库的智能体RAG助手",
        "title_ja": "ARag：社内ナレッジ横断のエージェント型RAG",
        "description":
            "An agentic RAG assistant that reaches across stamped scans, handwritten notes, flowchart photos and multi-page PDFs, and answers with inline citations. On top of MinerU layout parsing, BGE-M3 embeddings and Qdrant hybrid search (RRF → rerank → neighbour expansion), the agent loop (rewrite → retrieve → grade → answer → verify) re-queries whenever the evidence falls short, so multi-hop questions resolve across several documents at once.",
        "desc_zh": "可跨盖章扫描件、手写批注、流程图照片与多页PDF检索，并生成带引用回答的智能体RAG助手。在 MinerU 版面解析、BGE-M3 向量与 Qdrant 混合检索（RRF → rerank → 邻近扩展）之上，Agent 循环（改写 → 检索 → 相关性判定 → 回答 → 校验）会在证据不足时自动重新检索，因此多跳问题可以一次性跨多份文档得出结论。",
        "desc_ja": "押印スキャン帳票・手書き注記・フロー図の写真・複数ページPDFまで横断検索し、引用付きで回答するエージェント型RAGアシスタント。MinerUのレイアウト解析、BGE-M3の埋め込み、Qdrantのハイブリッド検索（RRF → rerank → 近傍拡張）の上で、エージェントループ（書き換え → 検索 → 関連性判定 → 回答 → 検証）が根拠不足を検知して再検索するため、多ホップの問いも複数文書をまたいで解ける。",
        "tags": ["Agentic RAG", "LangGraph", "AI SDK", "OpenAI", "Claude", "Qdrant", "BGE-M3", "MinerU", "FastAPI", "Next.js"],
        "shots": [
            {
                src: arag_answer_multihop,
                caption: {
                    en: "Multi-hop root-cause analysis across five documents",
                    ja: "多ホップ根因分析：5文書をまたぐ時系列",
                    zh: "多跳根因分析：跨五份文档的时间线",
                },
            },
            {
                src: arag_agent_steps,
                caption: {
                    en: "Agent trace: two retrieval rounds, hybrid search and rerank",
                    ja: "エージェント実行トレース：2ラウンドの再検索とrerank",
                    zh: "智能体执行轨迹：两轮检索、混合检索与重排序",
                },
            },
            {
                src: arag_image_understanding,
                caption: {
                    en: "A photographed flowchart read back as a graph",
                    ja: "フロー図の写真をグラフとして読み直す",
                    zh: "将流程图照片还原为图结构",
                },
            },
            {
                src: arag_scanned_form,
                caption: {
                    en: "Field extraction from a stamped, handwritten scan",
                    ja: "押印・手書きのスキャン帳票から項目を抽出",
                    zh: "从盖章手写扫描单据中抽取字段",
                },
            },
            {
                src: arag_table_extraction,
                caption: {
                    en: "Cross-page PDF financial tables, restructured",
                    ja: "ページをまたぐPDFの財務表を構造化",
                    zh: "跨页 PDF 财务表结构化",
                },
            },
            {
                src: arag_sources_panel,
                caption: {
                    en: "Citation panel with the original document alongside",
                    ja: "出典パネルと原本プレビューの並列表示",
                    zh: "出典面板与原文预览并排显示",
                },
            },
            {
                src: arag_document_library,
                caption: {
                    en: "Document library with per-file parse status",
                    ja: "文書ライブラリとファイル別の解析状況",
                    zh: "文档库与逐个文件的解析状态",
                },
            },
        ] satisfies ProjectShot[],
        "demoUrl": "#"
    },
    {
        "slug": "arag-agents",
        // 事例の骨格。問題と判断は既存の説明文から要約したもの。
        // role と result は本人しか書けないので空のまま。空欄は描画しない。
        "caseStudy": {
                  "problem": {
                            "zh": "协商交期要人工在 ERP 里查未出库订单和即时库存，再对着交付周期表和工作日历算，算完还要解释依据。",
                            "ja": "交渉用の納期を出すのに、ERP で未出荷注文と即時在庫を人手で調べ、リードタイム表と稼働カレンダーを突き合わせて計算し、根拠も説明する必要があった。",
                            "en": "Quoting a delivery date meant manually pulling open orders and live stock from the ERP, working it out against lead-time tables and the working calendar, then explaining the reasoning."
                  },
                  "decisions": {
                            "zh": "做成插件式能力包，从金蝶 ERP 取数后自动推算。逐字段展示测算依据，业务人员能核对每一个数字，确认后一键写回销售订单。",
                            "ja": "プラグイン式の能力パックにし、Kingdee ERP から取得して自動で算出。項目ごとに根拠を出して担当者が数字を確認でき、確定すると受注に書き戻す。",
                            "en": "Built as a plug-in capability pack that reads Kingdee ERP and computes the date. Every field shows its basis so staff can check each number, then write it back to the sales order in one step."
                  },
                  "role": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  },
                  "result": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  }
        },
        "title": "ARag Agents: an agent that operates the ERP",
        "title_zh": "ARag Agents：可操作 ERP 的业务智能体",
        "title_ja": "ARag Agents：ERPを操作する業務エージェント",
        "description":
            "Plug-in capability packages that turn the assistant into an agent operating the company's ERP (Kingdee). It pulls open orders and live stock, derives a negotiated delivery date from the production cycle table and the working calendar, shows the derivation field by field so a planner can check every number, and writes the agreed date back to the sales order.",
        "desc_zh": "将助手扩展为可操作业务系统的插件式能力包。从金蝶 ERP 取得未出库订单与即时库存，按交付周期表与工作日历推算协商交期；逐字段展示测算依据，业务人员可以核对每一个数字，确认后一键写回销售订单。",
        "desc_ja": "アシスタントを業務システム操作エージェントに変えるプラグイン型の能力パッケージ。金蝶ERPから受注残と即時在庫を取得し、納期テーブルと稼働カレンダーで協議納期を算出する。根拠をフィールド単位で示すので担当者が数字を検証でき、確定した納期は受注伝票へ書き戻せる。",
        "tags": ["Business Agent", "Tool Use", "MCP", "Kingdee ERP", "Capability SDK", "AI SDK", "DeepSeek", "TypeScript", "Postgres", "Docker"],
        "shots": [
            {
                src: arag_agents_home,
                caption: {
                    en: "Two business agents and the steps each one runs",
                    ja: "業務エージェント2種と、それぞれの処理ステップ",
                    zh: "两个业务智能体及各自的处理步骤",
                },
            },
            {
                src: arag_agent_delivery_trace,
                caption: {
                    en: "Delivery date derived field by field from ERP records",
                    ja: "ERPのフィールド単位で示す納期の算出根拠",
                    zh: "按 ERP 字段逐项展示交期测算依据",
                },
            },
            {
                src: arag_agent_delivery_writeback,
                caption: {
                    en: "Order-level summary, ready to write back to the ERP",
                    ja: "受注単位の集計とERPへの書き戻し",
                    zh: "订单级汇总，可直接写回 ERP",
                },
            },
            {
                src: arag_agent_scheduling,
                caption: {
                    en: "The working calendar pushes T+2 past the weekend",
                    ja: "稼働カレンダーがT+2を週明けへ繰り延べる",
                    zh: "工作日历将 T+2 顺延至周一",
                },
            },
        ] satisfies ProjectShot[],
        "demoUrl": "#"
    },
    {
        "slug": "contract-analyzer",
        // 事例の骨格。問題と判断は既存の説明文から要約したもの。
        // role と result は本人しか書けないので空のまま。空欄は描画しない。
        "caseStudy": {
                  "problem": {
                            "zh": "合同审阅靠人逐条读，风险点容易漏，改法也要凭经验。",
                            "ja": "契約レビューは条項を一つずつ人が読む作業で、リスクの見落としが起きやすく、修正案も経験頼みだった。",
                            "en": "Contract review means reading clause by clause. Risks get missed, and the suggested wording depends on who is reading."
                  },
                  "decisions": {
                            "zh": "做成上传即分析的 Web 应用，由 AI 标出风险条款并给出修改建议，人来判断采纳与否。",
                            "ja": "アップロードするだけで解析する Web アプリにし、AI がリスク条項を指摘して修正案を出し、採否は人が判断する形にした。",
                            "en": "A web app that analyses on upload: the model flags risky clauses and proposes wording, and a person decides whether to take it."
                  },
                  "role": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  },
                  "result": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  }
        },
        "title": "Contract Analyzer: Analyze contracts with AI",
        "title_zh": "AI合同分析：使用AI分析合同风险并提出修改建议",
        "title_ja": "AI契約書分析：AIによる契約リスク分析と提案",
        "description":
            "This is a project that analyzes contracts with AI. It is a web application that allows users to upload a contract and analyze it with AI.",
        "desc_zh": "使用AI分析合同风险的Web应用程序。它允许用户上传合同并使用AI分析合同风险并提出修改建议。",
        "desc_ja": "AIによる契約リスク分析のWebアプリケーションです。ユーザーは契約書をアップロードし、AIによって契約リスクを分析し、分析結果・提案をUIで表示。",
        "tags": ["OpenAI", "GPT-5", "AI", "LLM",  "Prompt Engineering", "Web", "Python", "TypeScript", "Vercel"],
        "shots": [
            {
                src: contract_analyzer_content,
                caption: {
                    en: "Clause-by-clause analysis of the uploaded contract",
                    ja: "アップロードした契約書の条項別分析",
                    zh: "对上传合同的逐条分析",
                },
            },
            {
                src: contract_analyzer_upload,
                caption: {
                    en: "Uploading a contract for review",
                    ja: "契約書のアップロード画面",
                    zh: "合同上传界面",
                },
            },
            {
                src: contract_analyzer_output,
                caption: {
                    en: "Identified risks and suggested revisions",
                    ja: "抽出されたリスクと修正提案",
                    zh: "识别出的风险与修改建议",
                },
            },
        ] satisfies ProjectShot[],
        "demoUrl": "#"
    },
    {
        "slug": "employee-management",
        // 事例の骨格。問題と判断は既存の説明文から要約したもの。
        // role と result は本人しか書けないので空のまま。空欄は描画しない。
        "caseStudy": {
                  "problem": {
                            "zh": "管理者要知道员工此刻在做什么、日程如何，只能逐个问或翻各自的日历。",
                            "ja": "管理者が「今この人が何をしているか」を知るには、本人に聞くか各自のカレンダーを開いて回るしかなかった。",
                            "en": "To see what someone is working on right now, a manager had to ask them or open each person's calendar one by one."
                  },
                  "decisions": {
                            "zh": "接 Google Calendar API，把日程和当前状态汇总到一个界面，实时更新。",
                            "ja": "Google Calendar API をつなぎ、予定と現在の状態を1画面に集約してリアルタイムに更新する。",
                            "en": "Wired up the Google Calendar API so schedules and current status land on one screen and update live."
                  },
                  "role": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  },
                  "result": {
                            "zh": "",
                            "ja": "",
                            "en": ""
                  }
        },
        "title": "Employee Management System: Manage employees with Goolge Calendar API",
        "title_zh": "员工管理系统：使用Google Calendar API实时查看管理员工的日程与目前状态",
        "title_ja": "従業員管理システム：Google Calendar APIによる従業員の日程と状態をリアルタイムで確認",
        "description": "This is a project that manages employees with Google Calendar API. It is a web application that allows users to manage employees with Google Calendar API and check the schedule and status of employees in real time.",
        "desc_zh": "使用Google Calendar API管理员工的Web应用程序。它允许用户管理员工并使用Google Calendar API实时查看管理员工的日程与目前状态。",
        "desc_ja": "Google Calendar APIを使用した従業員管理システムです。従業員の日程と状態をリアルタイムで確認できます。",
        "tags": ["Google", "Calendar", "API", "WebSockets", "Clerk", "Next.js", "React", "TypeScript", "Tailwind", "Shadcn", "Vercel"],
        "shots": [
            {
                src: employee_manager_home,
                caption: {
                    en: "Home view of the team's current status",
                    ja: "チームの現在の状態を映すホーム画面",
                    zh: "展示团队当前状态的首页",
                },
            },
            {
                src: employee_manager_schedule,
                caption: {
                    en: "Schedules synced from Google Calendar",
                    ja: "Googleカレンダーと同期した予定表",
                    zh: "与 Google Calendar 同步的日程表",
                },
            },
            {
                src: employee_manager_card,
                caption: {
                    en: "Member card with presence and contact details",
                    ja: "在席状況と連絡先を載せたメンバーカード",
                    zh: "含在席状态与联系方式的成员卡片",
                },
            },
            {
                src: employee_manager_leave,
                caption: {
                    en: "Leave requests and approval state",
                    ja: "休暇申請と承認状況",
                    zh: "休假申请与审批状态",
                },
            },
            {
                src: employee_manager_dashboard,
                caption: {
                    en: "Dashboard of attendance across the team",
                    ja: "チーム全体の勤怠ダッシュボード",
                    zh: "团队整体的考勤看板",
                },
            },
            {
                src: employee_manager_responsive,
                caption: {
                    en: "The same views on a phone",
                    ja: "同じ画面のモバイル表示",
                    zh: "同一界面的移动端显示",
                },
            },
        ] satisfies ProjectShot[],
        "demoUrl": "#"
    },
]

/** スキルのピル。AI/エージェント → バックエンド → フロントエンド →
 *  データ → インフラ → ツール の順で並べ、今の主戦場から先に読めるようにしている。 */
/**
 * スキルの並べ方。平らに24個並べても「何ができる人か」は伝わらない。
 * 上のグループほど中心。id は skillsDataWithIcons のものを指す。
 *
 * 意図的に外したもの:
 *   web    — 情報量がない
 *   github / gitlab — git に含める。3つ並べても3つぶんの意味はない
 */
export const skillGroups = [
  { key: "group_ai", ids: ["agentic-rag", "langgraph", "openai", "claude", "vector-search"] },
  { key: "group_backend", ids: ["python", "fastapi", "django", "nodejs", "csharp", "postgres", "dbt", "snowflake"] },
  { key: "group_frontend", ids: ["typescript", "react", "nextjs", "tailwind"] },
  { key: "group_infra", ids: ["aws", "docker", "vercel", "git"] },
] as const;

export const skillsDataWithIcons = [
  {
    id: "agentic-rag",
    name: "Agentic RAG",
    icon: React.createElement(FaRobot, { className: "text-xl" }),
    desc: {
      zh: "智能体RAG的设计与实现",
      en: "Agentic RAG design and delivery",
      ja: "エージェント型RAGの設計・実装"
    }
  },
  {
    id: "langgraph",
    name: "LangGraph",
    icon: React.createElement(SiLangchain, { className: "text-xl" }),
    desc: {
      zh: "多智能体编排",
      en: "Multi-agent orchestration",
      ja: "マルチエージェントのオーケストレーション"
    }
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: React.createElement(SiOpenai, { className: "text-xl" }),
    desc: {
      zh: "OpenAI API",
      en: "OpenAI API",
      ja: "OpenAI API"
    }
  },
  {
    id: "claude",
    name: "Claude",
    icon: React.createElement(SiAnthropic, { className: "text-xl" }),
    desc: {
      zh: "Anthropic Claude API",
      en: "Anthropic Claude API",
      ja: "Anthropic Claude API"
    }
  },
  {
    id: "vector-search",
    name: "Vector Search",
    icon: React.createElement(FaDatabase, { className: "text-xl" }),
    desc: {
      zh: "基于 Qdrant 与 BGE-M3 的混合检索",
      en: "Hybrid retrieval with Qdrant and BGE-M3",
      ja: "Qdrant・BGE-M3によるハイブリッド検索"
    }
  },
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
    id: "fastapi",
    name: "FastAPI",
    icon: React.createElement(SiFastapi, { className: "text-xl" }),
    desc: {
      zh: "FastAPI 服务开发",
      en: "FastAPI services",
      ja: "FastAPIでのAPI開発"
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
    id: "tailwind",
    name: "Tailwind CSS",
    icon: React.createElement(SiTailwindcss, { className: "text-xl" }),
    desc: {
      zh: "Tailwind CSS",
      en: "Tailwind CSS",
      ja: "Tailwind CSS"
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
    id: "postgres",
    name: "PostgreSQL",
    icon: React.createElement(SiPostgresql, { className: "text-xl" }),
    desc: {
      zh: "PostgreSQL",
      en: "PostgreSQL",
      ja: "PostgreSQL"
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
  },
  {
    id: "aws",
    name: "AWS",
    icon: React.createElement(FaAws, { className: "text-xl" }),
    desc: {
      zh: "AWS（EC2、S3、Lambda）",
      en: "AWS (EC2, S3, Lambda)",
      ja: "AWS（EC2・S3・Lambda）"
    }
  },
  {
    id: "docker",
    name: "Docker",
    icon: React.createElement(SiDocker, { className: "text-xl" }),
    desc: {
      zh: "Docker 与 Compose",
      en: "Docker and Compose",
      ja: "Docker・Compose"
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
