import { getTranslations } from "next-intl/server";
import { Bot, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import LocaleSwitcher from "./LocaleSwitcher";
import type { Locale } from "@/i18n/routing";

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const links = [
    { label: nav("about"), href: "/about" },
    { label: nav("products"), href: "/products" },
    { label: nav("cases"), href: "/cases" },
    { label: nav("news"), href: "/news" },
    { label: nav("contact"), href: "/contact" },
  ] as const;
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-cyber to-royal text-abyss"><Bot size={20} /></span>
            <span className="font-display text-xl font-bold tracking-widest">AIQC</span>
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{t("tagline")}</p>
          <LocaleSwitcher className="mt-4" />
        </div>
        <div>
          <p className="mb-3 font-semibold">{t("quickLinks")}</p>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-1 text-sm text-zinc-400 hover:text-cyber">{l.label}</Link>
          ))}
        </div>
        <div>
          <p className="mb-3 font-semibold">{t("contactUs")}</p>
          <p className="flex items-center gap-2 py-1 text-sm text-zinc-400"><Phone size={14} /> {siteConfig.contact.phone}</p>
          <p className="flex items-center gap-2 py-1 text-sm text-zinc-400"><Mail size={14} /> {siteConfig.contact.email}</p>
          <p className="flex items-center gap-2 py-1 text-sm text-zinc-400"><MapPin size={14} /> {siteConfig.contact.address[locale]}</p>
        </div>
        <div>
          <p className="mb-3 font-semibold">{nav("products")}</p>
          <p className="py-1 text-sm text-zinc-400">…</p>
          <Link href="/admin" className="py-1 text-sm text-zinc-500 hover:text-zinc-300">{nav("admin")}</Link>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} AIQC{siteConfig.fullName ? ` · ${siteConfig.fullName}` : ""} — {t("rights")}
      </div>
    </footer>
  );
}
