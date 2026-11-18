import NewsEditor from "@/components/admin/NewsEditor";
import { getAdminDict } from "@/i18n/admin";
export default async function Page() {
  const { t } = await getAdminDict();
  return <><h1 className="mb-6 text-2xl font-bold">{t.create} · {t.news}</h1><NewsEditor dict={t} /></>;
}
