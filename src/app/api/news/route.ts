import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** 已发布新闻 JSON（供小程序/App 等外部渠道复用） */
export async function GET() {
  const news = await db.news.findMany({ where: { isPublished: true }, orderBy: { publishDate: "desc" } });
  return NextResponse.json(news);
}
