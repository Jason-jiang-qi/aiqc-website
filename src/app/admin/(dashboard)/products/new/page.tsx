import ProductEditor from "@/components/admin/ProductEditor";
import { getAdminDict } from "@/i18n/admin";
export default async function Page() {
  const { t } = await getAdminDict();
  return <><h1 className="mb-6 text-2xl font-bold">{t.create} · {t.products}</h1><ProductEditor dict={t} /></>;
}
