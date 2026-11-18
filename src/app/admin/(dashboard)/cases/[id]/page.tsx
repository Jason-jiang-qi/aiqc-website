import { notFound } from "next/navigation";
import CaseEditor from "@/components/admin/CaseEditor";
import { db } from "@/lib/db";
import { getAdminDict } from "@/i18n/admin";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const item = await db.case.findUnique({ where: { id: (await params).id } });
  if (!item) notFound();
  const { t } = await getAdminDict();
  return <><h1 className="mb-6 text-2xl font-bold">{t.edit} · {item.zhTitle}</h1><CaseEditor dict={t} initial={item as never} /></>;
}
