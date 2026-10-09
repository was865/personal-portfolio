import { revalidatePath } from "next/cache";
import { verifyWebhookSignature } from "@notionhq/client";

/**
 * Notion の Webhook を受けて、ブログの ISR キャッシュを捨てる。
 *
 * 設定手順（README にも記載）:
 * 1. Notion のインテグレーション設定 → Webhooks で、URL に
 *    https://<サイト>/api/revalidate を登録する
 * 2. 登録時に Notion がこの URL へ verification_token を POST する。
 *    Vercel のログに出るので、その値を Notion の画面に貼って検証を終える
 * 3. 同じ値を環境変数 NOTION_WEBHOOK_VERIFICATION_TOKEN に入れて再デプロイする
 *
 * 未設定でもサイトは動く（一覧は 1 分、記事は 5 分で入れ替わる）。
 */
export async function POST(request: Request) {
  const body = await request.text();

  let payload: { verification_token?: string; type?: string } = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // 初回の検証リクエスト。署名は付かないので、トークンをログに出すだけにする。
  if (payload.verification_token) {
    console.info(`[notion-webhook] verification_token: ${payload.verification_token}`);
    return Response.json({ ok: true });
  }

  const token = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN;
  if (!token) {
    return new Response("Webhook is not configured", { status: 503 });
  }

  const valid = await verifyWebhookSignature({
    body,
    signature: request.headers.get("x-notion-signature"),
    verificationToken: token,
  });
  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // どの記事が変わったかは見ずに、ブログ配下をまとめて作り直す。
  // 記事数が少ないうちはこれで十分で、取りこぼしも起きない。
  revalidatePath("/[locale]/blog", "layout");
  console.info(`[notion-webhook] revalidated blog for ${payload.type ?? "unknown event"}`);

  return Response.json({ ok: true });
}
