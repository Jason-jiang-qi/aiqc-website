import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, Newspaper, Briefcase, MessageSquare } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminDict } from "@/i18n/admin";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import { logout } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const { locale, t } = await getAdminDict();
  const NAV = [
    { label: t.dashboard, href: "/admin", icon: LayoutDashboard },
    { label: t.products, href: "/admin/products", icon: Package },
    { label: t.news, href: "/admin/news", icon: Newspaper },
    { label: t.cases, href: "/admin/cases", icon: Briefcase },
    { label: t.messages, href: "/admin/messages", icon: MessageSquare },
  ];
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-e bg-white p-4">
        <p className="px-2 font-display text-lg font-bold tracking-widest">AIQC</p>
        <p className="mb-4 px-2 text-xs text-zinc-500">{t.admin} · {admin.name}</p>
        <AdminLocaleSwitcher current={locale} />
        <nav className="mt-4 flex-1 space-y-1 text-sm">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2 rounded-md px-2 py-2 text-zinc-700 hover:bg-zinc-100">
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="px-2 py-2 text-sm text-zinc-500 hover:text-zinc-900">{t.viewSite}</Link>
        <form action={logout}>
          <button className="px-2 py-2 text-sm text-zinc-500 hover:text-red-600">{t.logout}</button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
