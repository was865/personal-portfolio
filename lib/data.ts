import React from "react";
import { FaReact, FaVuejs, FaGithub, FaWeixin, FaGlobe  } from "react-icons/fa";
import { LuGraduationCap, LuMusic, LuGlobe2 } from "react-icons/lu";
import tank from '@/public/tank.png';
import NetEasemusic from "@/public/NetEasemusic.png";
import cupt from "@/public/cupt.jpg";
import xb2 from "@/public/xb2-node.jpg";
import airiot from "@/public/airiot.png";
import draws from "@/public/draws.jpg";

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
    // {
    //     name: "Contact",
    //     hash: "#contact",
    // },
] as const;


export const headerLanguageMap = {
    Home: '首页',
    About: '关于我',
    Projects: '我的项目',
    Skills: '我的技能',
    Experiences: '我的经历',
}

export const experiencesData = [
    {
        title: "Personal website building",
        location: "spongebob.vip",
        description:
            "With a strong interest, independent learning to build a personal website, equivalent to the completion of a wish. From the purchase and registration of the server and domain name to the subsequent complex filing, as well as the deployment and launch of the final project, a person went through a lot of learning and consulting materials to complete the whole process, during which I encountered a lot of bugs, but continuous learning makes me feel happy! Full of power!",
        icon: React.createElement(FaGlobe),
        date: "2024 Dec - 2025 Feb",
    },
    {
        title: "Personal wechat public account creation and operation",
        // location: React.createElement("span", {},
        //     React.createElement("a", {
        //         href: "https://www.nio.com/",
        //         style: { textDecoration: 'underline' },
        //         target: "_blank"
        //     }, "NIO Inc."),
        //     " Wuhan, China"
        // ),
        location: "JieNitang",
        description:
            "When the website was being built, I opened the growth footprint of my wechat public account, and it showed that I had only published three articles since I registered it on October 5th. The last article was on October 8th, and I had not published any more since then. Due to my studies and various miscellaneous trifles, I did not develop the habit of constantly updating my public account. I hope I can take this private traffic platform and help myself become a super individual!",
        icon: React.createElement(FaWeixin),
        date: "2024 Oct - On the way",
    },
    {
        title: "NetEase cloud music partner",
        location: "JieNitang",
        description:
            "October 18 officially became NetEase cloud music partner, very happy! Since I went to college, the entertainment I choose most is listening to music. Music can cheer me up and make me face all kinds of difficulties positively. It is an indispensable part of relieving pressure in my study and life. However, sometimes I will be addicted to the song, and even sway my body to the melody, and make a video for it because I love a song.",
        icon: React.createElement(LuMusic),
        date: "2024 Oct - In progress",
    },
    {
        title: "Join Github",
        location: "SpongeYuqi",
        description:
            "Late at night on September 12th, I remembered that I was still studying in the dormitory with my computer on, and my roommates were already lying in bed. I turned on the lamp to successfully enter the big family of Github. I felt very happy, because I realized that this was another new attempt. Improving myself, I enjoy it!",
        icon: React.createElement(FaGithub),
        date: "2024 Sep - In practice",
    },

]

export const experiencesDataZn = [
    {
        "title": "个人网站搭建",
        "location": "spongebob.vip",
        "description": "凭借浓厚的兴趣，自主学习搭建起个人网站，相当于完成了一个心愿。从服务器和域名的购买注册到后续的复杂备案，以及最终项目的全部部署上线，一个人通过大量的学习和查阅资料走完了全程，这期间遇到的Bug不少，但是不断地学习让我感到快乐！动力十足！",
        icon: React.createElement(FaGlobe),
        "date": "2024年12月 - 2025年2月"
    },
    {
        "title": "个人微信公众号创建运营",
        "location": "芥泥糖",
        "description": `在网站搭建之时，我翻开我的微信公众号的成长足迹，显示从10月5日注册的公众号，只发表了3次文章，最后一次文章是在10月8日，之后就再也没发表过了，因为学业以及各种乱七八糟的琐事，使我没有养成这个习惯去不断地更新我的公众号，希望自己能够好好把我这个私域流量平台，助力自己成为超级个体！`,
        "icon": React.createElement(FaWeixin),
        "date": "2024年10月 - 在路上"
    },
    {
        "title": "网易云音乐合伙人",
        "location": "芥泥糖",
        "description": "10月18日正式成为网易云音乐合伙人，异常高兴！自从上大学后，选择的娱乐方式最多的就是听歌，音乐能振奋我，让我积极的面对种种的困难，是我在学习生活中舒缓压力的不可缺少的一部分。不过有时候会听歌上瘾，甚至会随着旋律摇摆身体，也会因为爱上一首歌而为它特地制作视频。",
        "icon": React.createElement(LuMusic),
        "date": "2024年10月 - 持续中"
    },
    {
        "title": "入驻Github",
        "location": "SpongeYuqi",
        "description": "9月12日深夜我记着我还在开着电脑在寝室进行学习，室友们都已经躺床上了，我开着台灯操作到入驻Github这个大家庭成功这一步骤，我深感喜悦，因为我意识到，这是又一次的新尝试，人生就是不断的尝试和历练自己，接触不同的领域就是不断地刷新自我，提升自我，我乐在其中！",
        "icon": React.createElement(FaGithub),
        "date": "2024年9月 - 践行中"
    },
]


export type ProjectTags = typeof projectsData[number]["tags"];

export const projectsData = [
    {
        "title": "Multi-functional fire tank 3D digital innovation design",
        "title_zh": "绝境卫戍——全维度智能应急平台",
        "description":
            "It aims to innovate the design of a multi-functional anti-disaster tank track vehicle, which integrates multiple functional modules in one, and this highly integrated design greatly improves the comprehensive rescue capability of a single platform.",
        "desc_zh": "旨在创新设计一款多功能抗灾坦克履带车，其集成了高强度履带、深度相机、热融合夜视仪、消防喷头、液压破拆钳、激光雷达、爆闪警示灯以及UWB定位系统等多个功能模块于一身，这种高度集成化设计极大地提高了单一平台的综合救援能力。",
        "tags": ["Fusion360", "C4D", "PR", "PS"],
        "imageUrl": tank,
        //"projectUrl": "https://b23.tv/bEJYAIN",
        "demoUrl": " https://b23.tv/bEJYAIN"
    },
    {
        title: "Backend service based on Node.js combined with \"express\"",
        title_zh: '基于Node.js结合express框架的后端服务',
        description:
            "The service integrates user login, authentication, comment, upload files, delete resources and other functions, and brings together the basic application framework and interface usage of nodejs.",
        desc_zh: "该服务集成了用户登录、验证、评论、上传文件、删除资源等功能，汇集了nodejs基本的应用框架和接口用法，并使用Navicate作为后台Mysql数据集成管理，通过Insomnia验证项目。",
        tags: ["Nodejs", "TypeScript", "express", "Mysql", "Navicate", "Insomnia"],
        imageUrl: xb2,
        demoUrl: 'https://github.com/spongeYuqi/xb2-node',
    },
    {
        title: "Smart healthcare regulatory system (AIRIOT)",
        title_zh: '基于AIRIOT的智慧医疗监管系统',
        description: "The intelligent medical system monitoring platform is committed to improving hospital operation efficiency and optimizing resource allocation, while strengthening patient experience and service quality, and forming a comprehensive hospital operation monitoring system.",
        desc_zh: "本项目旨在构建一个基于AIRIOT平台的智能医疗系统监管平台，致力于提升医院运营效率、优化资源配置与管理，同时强化患者体验和服务质量，形成全面的医院运营监控体系。通过操作快捷入口，管理者可快速访问各详细管理模块，实现深度数据挖掘与精细化管理。",
        tags: ["AIRIOT", "Mysql", "Navicate", ],
        imageUrl: airiot,
        demoUrl: 'https://www.airiot.tech/',
    },
    {
        title: "The 11th CUPT",
        title_zh: '第十一届大学生物理学术竞赛',
        description: "I participated in this competition as a representative of Harbin Institute of Technology in my freshman year. At that time, my research ability and debate ability were relatively weak. This competition laid the foundation for me to dare to go to the platform, be willing to show myself, constantly improve myself and explore myself.",
        desc_zh: "这项比赛是我在大一时作为代表前往哈尔滨工业大学参加的，那时候还很稚嫩，无论是研究能力还是辩论能力，都是比较弱的。对于我来说，这次竞赛奠定了我大学敢于上讲台，乐于展现自己，不断提升自我，自我探索的基础。",
        tags: ["cupt", "iypt", "gypt", "matlab", ],
        imageUrl: cupt,
        demoUrl: 'https://gypt.org/',
    },
    {
        title: "NetEase cloud music partner",
        title_zh: "网易云音乐合伙人",
        description:
            `Because of the love of music, willing to share, to become a master of pictures and notes, soon after, received an invitation from the official, became the 1080412 NetEase cloud music partner, and enjoy lifelong VIP rights for 100 days, the current accumulation of more than 2W songs, Lv10, often in the platform to share themselves.
            `,
        desc_zh: "因为热爱音乐，乐于分享，成为图文笔记达人，不久之后，收到来自官方的邀请，成为第1080412位网易云音乐合伙人，并享受终身VIP权益百天，目前累计听歌2W多首，Lv10，时常在平台分享自己。",
        tags: ["NetEase cloud", "Passion", "Music"],
        imageUrl: NetEasemusic,
        demoUrl: 'https://music.163.com/#/user/home?id=7816209974',
    },
    {
        title: "Drawing & Reflection",
        title_zh: "绘画 & 反思",
        description:
            `When I was a child, I could be said to be a painting genius, but as I grew up, I gradually stopped picking up a pen, perhaps because of laziness, hopelessness, and no motivation to stick to it. But from the beginning to the end, the artistic cells still flow, which also allows me to find beauty, create beauty, and strive to do everything I want to do well, adding personal characteristics. 
            `,
        desc_zh: "小时候，可谓是绘画天才，但随着长大，渐渐不再拿起笔，可能因为懒惰、无望，也没有坚持下去的动力，即使是天才，也逐渐淹没才能。但是从始至终，艺术细胞依旧流淌，这也让我能发现美，创造美，力求每件我想要做好的事都精益求精，加入个人的特色。这也造就了我爱探索新事物的品质，例如此次个人网站的搭建！",
        tags: [ "perseverance", "reproduction"],
        imageUrl: draws,
        demoUrl: '',
    },
    


]

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
