import "server-only";

import Prism from "prismjs";
// 言語定義はグローバルの Prism に登録される。依存順（jsx → tsx など）に並べる。
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-ini";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-graphql";

/** Notion の言語名 → Prism の言語 ID。 */
const ALIASES: Record<string, string> = {
  "plain text": "plain",
  shell: "bash",
  "c#": "csharp",
  "c++": "cpp",
  html: "markup",
  xml: "markup",
  markup: "markup",
  javascript: "javascript",
  typescript: "typescript",
  docker: "docker",
};

/** Notion の言語名を Prism の ID に直す。知らない言語は null（プレーン表示）。 */
export function prismLanguage(notionLanguage: string): string | null {
  const id = ALIASES[notionLanguage] ?? notionLanguage;
  return Prism.languages[id] ? id : null;
}

/** サーバ側でハイライト済みの HTML を作る。クライアントに Prism を送らずに済む。 */
export function highlight(code: string, notionLanguage: string): string | null {
  const id = prismLanguage(notionLanguage);
  if (!id) return null;
  return Prism.highlight(code, Prism.languages[id], id);
}
