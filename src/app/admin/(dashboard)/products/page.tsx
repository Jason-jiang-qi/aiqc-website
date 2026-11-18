import AdminList from "@/components/admin/AdminList";
import { db } from "@/lib/db";
import { getAdminDict } from "@/i18n/admin";
export const dynamic = "force-dynamic";
export default async function Page() {
  const { t } = await getAdminDict();
  const rows = await db.product.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
  return <AdminList kind="products" heading={t.products} dict={t} items={rows.map((r) => ({ id: r.id, title: r.zhTitle, isPublished: r.isPublished, updatedAt: r.updatedAt }))} />;
}
