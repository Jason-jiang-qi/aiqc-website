import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

function csvCell(v: string | null | undefined) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

/** 留言导出 CSV（需登录，带 BOM 保证 Excel 中文不乱码） */
export async function GET() {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const rows = await db.message.findMany({ orderBy: { createdAt: "desc" } });
  const products = Object.fromEntries((await db.product.findMany({ select: { slug: true, zhTitle: true } })).map((p) => [p.slug, p.zhTitle]));
  const lines = [
    ["姓名", "联系方式", "公司", "意向产品", "留言内容", "已处理", "时间"].map(csvCell).join(","),
    ...rows.map((m) =>
      [m.name, m.contact, m.company, m.product ? (products[m.product] ?? m.product) : "", m.content, m.isHandled ? "是" : "否", m.createdAt.toISOString()].map(csvCell).join(","),
    ),
  ];
  return new NextResponse("\uFEFF" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="messages-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
