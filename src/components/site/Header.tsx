"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Bot } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    { label: t("products"), href: "/products" },
    { label: t("cases"), href: "/cases" },
    { label: t("news"), href: "/news" },
    { label: t("contact"), href: "/contact" },
  ] as const;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-abyss/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-cyber to-royal text-abyss">
            <Bot size={20} />
          </span>
          <span className="font-display text-xl font-bold tracking-widest">AIQC</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isActive(item.href) ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:flex" />
          <Link
            href="/contact"
            className="hidden rounded-full bg-gradient-to-r from-cyber to-royal px-4 py-2 text-sm font-medium text-abyss transition hover:opacity-90 md:block"
          >
            {t("contact")}
          </Link>
          <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-abyss px-4 py-3 lg:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
          <LocaleSwitcher className="px-3 py-2" />
        </nav>
      )}
    </header>
  );
}
