"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentAdmin, destroySession } from "@/lib/auth";
import {
  productInputSchema, newsInputSchema, caseInputSchema,
  type ProductInput, type NewsInput, type CaseInput,
} from "@/lib/validators";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

const orNull = (v?: string) => (v?.trim() ? v : null);

/** 编辑器保存返回错误信息（成功返回 null，由前端跳转列表页） */
export async function saveProduct(input: ProductInput): Promise<string | null> {
  await requireAdmin();
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "参数不正确";
  const d = parsed.data;
  const data = {
    slug: d.slug, cover: orNull(d.cover), images: d.images, isPublished: d.isPublished,
    featured: d.featured, order: d.order,
    zhTitle: d.zhTitle, enTitle: d.enTitle, arTitle: d.arTitle,
    zhDesc: orNull(d.zhDesc), enDesc: orNull(d.enDesc), arDesc: orNull(d.arDesc),
    zhBody: orNull(d.zhBody), enBody: orNull(d.enBody), arBody: orNull(d.arBody),
    features: d.features, specs: d.specs, scenarios: d.scenarios,
  };
  try {
    if (d.id) await db.product.update({ where: { id: d.id }, data });
    else await db.product.create({ data });
  } catch {
    return "保存失败：slug 可能已存在";
  }
  revalidatePath("/admin/products");
  return null;
}

export async function saveNews(input: NewsInput): Promise<string | null> {
  await requireAdmin();
  const parsed = newsInputSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "参数不正确";
  const d = parsed.data;
  const data = {
    slug: d.slug, cover: orNull(d.cover), isPublished: d.isPublished, publishDate: new Date(d.publishDate),
    zhTitle: d.zhTitle, enTitle: d.enTitle, arTitle: d.arTitle,
    zhSummary: orNull(d.zhSummary), enSummary: orNull(d.enSummary), arSummary: orNull(d.arSummary),
    zhBody: orNull(d.zhBody), enBody: orNull(d.enBody), arBody: orNull(d.arBody),
  };
  try {
    if (d.id) await db.news.update({ where: { id: d.id }, data });
    else await db.news.create({ data });
  } catch {
    return "保存失败：slug 可能已存在";
  }
  revalidatePath("/admin/news");
  return null;
}

export async function saveCase(input: CaseInput): Promise<string | null> {
  await requireAdmin();
  const parsed = caseInputSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "参数不正确";
  const d = parsed.data;
  const data = {
    slug: d.slug, cover: orNull(d.cover), images: d.images, isPublished: d.isPublished,
    featured: d.featured, order: d.order,
    zhTitle: d.zhTitle, enTitle: d.enTitle, arTitle: d.arTitle,
    zhClient: orNull(d.zhClient), enClient: orNull(d.enClient), arClient: orNull(d.arClient),
    zhDesc: orNull(d.zhDesc), enDesc: orNull(d.enDesc), arDesc: orNull(d.arDesc),
    zhBody: orNull(d.zhBody), enBody: orNull(d.enBody), arBody: orNull(d.arBody),
    metrics: d.metrics,
  };
  try {
    if (d.id) await db.case.update({ where: { id: d.id }, data });
    else await db.case.create({ data });
  } catch {
    return "保存失败：slug 可能已存在";
  }
  revalidatePath("/admin/cases");
  return null;
}

type Kind = "products" | "news" | "cases";
const models = { products: db.product, news: db.news, cases: db.case } as const;

export async function deleteItem(kind: Kind, id: string) {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (models[kind] as any).delete({ where: { id } });
  revalidatePath(`/admin/${kind}`);
}

export async function togglePublish(kind: Kind, id: string, published: boolean) {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (models[kind] as any).update({ where: { id }, data: { isPublished: published } });
  revalidatePath(`/admin/${kind}`);
}

export async function setMessageHandled(id: string, handled: boolean) {
  await requireAdmin();
  await db.message.update({ where: { id }, data: { isHandled: handled } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await db.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
