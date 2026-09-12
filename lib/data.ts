/** 画面内ナビゲーションの並び。コンテンツではなく画面構造なので CMS ではなくコードで持つ。
 *  文言は messages の Header 名前空間、スクロール先は各セクションの id と対応する。 */
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
