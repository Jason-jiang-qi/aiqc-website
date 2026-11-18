import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

/** 已发布产品 JSON（供小程序/App 等外部渠道复用） */
export async function GET() {
  return NextResponse.json(await getProducts());
}
