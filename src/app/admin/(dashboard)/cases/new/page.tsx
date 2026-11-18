import CaseEditor from "@/components/admin/CaseEditor";
import { getAdminDict } from "@/i18n/admin";
export default async function Page() {
  const { t } = await getAdminDict();
  return <><h1 className="mb-6 text-2xl font-bold">{t.create} · {t.cases}</h1><CaseEditor dict={t} /></>;
}
