import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { db } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function entries(path: string, priority: number, extra?: Partial<MetadataRoute.Sitemap[number]>) {
  return routing.locales.map((locale) => ({
    url: `${BASE}${locale === routing.defaultLocale ? "" : `/${locale}`}${path}`,
    priority,
    ...extra,
  }));
}

/** 三语 sitemap：静态页 + 产品/案例/新闻详情 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, cases, news] = await Promise.all([
    db.product.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.case.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    db.news.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    ...entries("", 1),
    ...entries("/about", 0.8),
    ...entries("/products", 0.9),
    ...entries("/cases", 0.8),
    ...entries("/news", 0.8),
    ...entries("/contact", 0.7),
    ...products.flatMap((p) => entries(`/products/${p.slug}`, 0.8, { lastModified: p.updatedAt })),
    ...cases.flatMap((c) => entries(`/cases/${c.slug}`, 0.7, { lastModified: c.updatedAt })),
    ...news.flatMap((n) => entries(`/news/${n.slug}`, 0.6, { lastModified: n.updatedAt })),
  ];
}
