import { db } from "./db";

/** 前台数据查询层（只查已发布）—— 后续加缓存/搜索时集中改此文件 */
export const getProducts = () =>
  db.product.findMany({ where: { isPublished: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

export const getProductBySlug = (slug: string) =>
  db.product.findFirst({ where: { slug, isPublished: true } });

export const getCases = () =>
  db.case.findMany({ where: { isPublished: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

export const getCaseBySlug = (slug: string) =>
  db.case.findFirst({ where: { slug, isPublished: true } });

export const NEWS_PAGE_SIZE = 6;

export async function getNewsPage(page: number) {
  const [items, total] = await Promise.all([
    db.news.findMany({
      where: { isPublished: true },
      orderBy: { publishDate: "desc" },
      skip: (page - 1) * NEWS_PAGE_SIZE,
      take: NEWS_PAGE_SIZE,
    }),
    db.news.count({ where: { isPublished: true } }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE)) };
}

export const getNewsBySlug = (slug: string) =>
  db.news.findFirst({ where: { slug, isPublished: true } });

/** 详情页上一篇/下一篇（按发布日期） */
export async function getNewsNeighbors(publishDate: Date, id: string) {
  const [prev, next] = await Promise.all([
    db.news.findFirst({
      where: { isPublished: true, OR: [{ publishDate: { lt: publishDate } }, { publishDate, id: { lt: id } }] },
      orderBy: [{ publishDate: "desc" }, { id: "desc" }],
    }),
    db.news.findFirst({
      where: { isPublished: true, OR: [{ publishDate: { gt: publishDate } }, { publishDate, id: { gt: id } }] },
      orderBy: [{ publishDate: "asc" }, { id: "asc" }],
    }),
  ]);
  return { prev, next };
}
