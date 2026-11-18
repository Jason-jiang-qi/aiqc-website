"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { zh: "中文", en: "EN", ar: "العربية" };

/** 语言切换器：保持当前路径切换语言，并经 cookie 记忆偏好（next-intl 自动写 NEXT_LOCALE） */
export default function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={`rounded-full px-2.5 py-1 text-xs transition ${
            l === locale ? "bg-cyan-400/20 text-cyan-300" : "text-zinc-400 hover:text-white"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
