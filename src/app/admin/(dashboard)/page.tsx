import Link from "next/link";
import { db } from "@/lib/db";
import { getAdminDict } from "@/i18n/admin";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { t } = await getAdminDict();
  const [products, news, cases, unhandled] = await Promise.all([
    db.product.count(),
    db.news.count(),
    db.case.count(),
    db.message.count({ where: { isHandled: false } }),
  ]);
  const cards = [
    { label: t.productCount, value: products, href: "/admin/products" },
    { label: t.newsCount, value: news, href: "/admin/news" },
    { label: t.caseCount, value: cases, href: "/admin/cases" },
    { label: t.unhandled, value: unhandled, href: "/admin/messages" },
  ];
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t.overview}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl border bg-white p-5 transition hover:shadow-md">
            <p className="text-sm text-zinc-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
