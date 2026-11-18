import { notFound } from "next/navigation";
import NewsEditor from "@/components/admin/NewsEditor";
import { db } from "@/lib/db";
import { getAdminDict } from "@/i18n/admin";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const item = await db.news.findUnique({ where: { id: (await params).id } });
  if (!item) notFound();
  const { t } = await getAdminDict();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t.edit} · {item.zhTitle}</h1>
      <NewsEditor
        dict={t}
        initial={{
          id: item.id, slug: item.slug, isPublished: item.isPublished,
          cover: item.cover ?? "", publishDate: item.publishDate.toISOString().slice(0, 10),
          zhTitle: item.zhTitle, enTitle: item.enTitle, arTitle: item.arTitle,
          zhSummary: item.zhSummary ?? undefined, enSummary: item.enSummary ?? undefined, arSummary: item.arSummary ?? undefined,
          zhBody: item.zhBody ?? undefined, enBody: item.enBody ?? undefined, arBody: item.arBody ?? undefined,
        }}
      />
    </>
  );
}
