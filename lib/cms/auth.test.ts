import { afterEach, beforeEach, expect, it, vi } from "vitest"

const cookieStore = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}))

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }))

const {
  compareToken,
  createSessionToken,
  hashPassword,
  requireAuth,
  verifyPassword,
  verifySessionToken,
} = await import("./auth")

beforeEach(() => {
  process.env.CMS_SESSION_SECRET = "test-secret-at-least-32-bytes-long!!"
  process.env.CMS_SERVICE_TOKEN = "service-token-value"
})

afterEach(() => {
  vi.clearAllMocks()
  cookieStore.get.mockReset()
  delete process.env.CMS_SESSION_SECRET
  delete process.env.CMS_SERVICE_TOKEN
  delete process.env.CMS_ADMIN_PASSWORD_HASH
})

it("長さの違うトークンでも例外を投げず false", () => {
  expect(compareToken("short", "muchlongertokenvalue")).toBe(false)
})

it("同じトークンなら true", () => {
  expect(compareToken("abc123", "abc123")).toBe(true)
})

it("scrypt のハッシュを検証できる", () => {
  const stored = hashPassword("correct horse")

  expect(stored.startsWith("scrypt:")).toBe(true)
  expect(verifyPassword("correct horse", stored)).toBe(true)
  expect(verifyPassword("wrong horse", stored)).toBe(false)
})

it("同じパスワードでも毎回違うハッシュになる（salt が効いている）", () => {
  expect(hashPassword("same")).not.toBe(hashPassword("same"))
})

it("env ローダの変数展開を避けるため区切りに $ を使わない", () => {
  expect(hashPassword("x")).not.toContain("$")
})

it("壊れた保存値では検証が false になり、例外を投げない", () => {
  expect(verifyPassword("x", "")).toBe(false)
  expect(verifyPassword("x", "plaintext")).toBe(false)
  expect(verifyPassword("x", "bcrypt:salt:hash")).toBe(false)
})

it("発行したセッションを検証できる", async () => {
  const token = await createSessionToken()

  expect(await verifySessionToken(token)).toBe(true)
  expect(await verifySessionToken("not-a-jwt")).toBe(false)
})

it("別の秘密鍵で署名されたセッションは通さない", async () => {
  const token = await createSessionToken()
  process.env.CMS_SESSION_SECRET = "another-secret-at-least-32-bytes!!!!"

  expect(await verifySessionToken(token)).toBe(false)
})

it("サービストークンのヘッダで認証できる", async () => {
  const request = new Request("http://localhost/api/admin/content/projects", {
    headers: { "X-Service-Token": "service-token-value" },
  })

  expect(await requireAuth(request)).toBe("service")
})

it("サービストークンが違えば拒否する", async () => {
  const request = new Request("http://localhost/api/admin/content/projects", {
    headers: { "X-Service-Token": "wrong" },
  })

  expect(await requireAuth(request)).toBeNull()
})

it("サービストークンが未設定ならヘッダがあっても拒否する", async () => {
  delete process.env.CMS_SERVICE_TOKEN
  const request = new Request("http://localhost/api/admin/content/projects", {
    headers: { "X-Service-Token": "anything" },
  })

  expect(await requireAuth(request)).toBeNull()
})

it("Cookie のセッションで認証できる", async () => {
  const token = await createSessionToken()
  cookieStore.get.mockReturnValue({ value: token })

  expect(await requireAuth(new Request("http://localhost/admin"))).toBe("cookie")
})

it("Cookie が無ければ拒否する", async () => {
  cookieStore.get.mockReturnValue(undefined)

  expect(await requireAuth(new Request("http://localhost/admin"))).toBeNull()
})
