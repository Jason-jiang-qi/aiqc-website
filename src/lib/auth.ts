import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 天

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET 未配置，请复制 .env.example 为 .env");
  return new TextEncoder().encode(s);
}

export async function verifyCredentials(email: string, password: string) {
  const user = await db.admin.findUnique({ where: { email } });
  if (!user) return null;
  return (await bcrypt.compare(password, user.password)) ? user : null;
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** 供 Server Component / Server Action 使用：返回当前管理员，未登录返回 null */
export async function getCurrentAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return db.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });
  } catch {
    return null;
  }
}

/** 仅校验 token 是否有效（供 proxy.ts 做乐观拦截，不能替代页面内校验） */
export async function isValidToken(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}
