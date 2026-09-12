import { NextResponse } from "next/server"
import { z } from "zod"

import { jsonError } from "@/lib/cms/api"
import { endSession, isPasswordConfigured, startSession, verifyAdminPassword } from "@/lib/cms/auth"

export const runtime = "nodejs"

const loginSchema = z.object({ password: z.string().min(1) })

/** 失敗時はわざと待つ。総当たりの速度を落とすためで、成功時は待たない。 */
const FAILURE_DELAY_MS = 1000

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return jsonError(400, "invalid_request")

  if (!isPasswordConfigured()) return jsonError(503, "not_configured")

  if (!verifyAdminPassword(parsed.data.password)) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS))
    // 「パスワードが違う」以上のことは返さない
    return jsonError(401, "unauthorized")
  }

  await startSession()
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await endSession()
  return NextResponse.json({ ok: true })
}
