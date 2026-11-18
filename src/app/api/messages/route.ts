import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messageSchema } from "@/lib/validators";

/** 基础频率限制（单机内存版）：同一 IP 10 分钟最多 5 条；多实例部署时换 Redis */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

/** 前台留言提交（公开接口）：参数化查询由 Prisma 保证防注入 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "提交过于频繁，请稍后再试" }, { status: 429 });

  const body = await request.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "参数不正确" }, { status: 400 });
  }
  const message = await db.message.create({
    data: {
      name: parsed.data.name,
      contact: parsed.data.contact,
      company: parsed.data.company || null,
      product: parsed.data.product || null,
      content: parsed.data.content,
    },
  });
  return NextResponse.json({ ok: true, id: message.id }, { status: 201 });
}
