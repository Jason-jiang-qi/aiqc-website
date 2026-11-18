"use client";

import { useRouter } from "next/navigation";
import { ADMIN_LOCALES, type AdminLocale } from "@/i18n/admin-dict";

const LABELS: Record<AdminLocale, string> = { zh: "中文", en: "EN", ar: "العربية" };

/** 后台语言切换：写入 cookie 后刷新服务端渲染 */
export default function AdminLocaleSwitcher({ current }: { current: AdminLocale }) {
  const router = useRouter();
  function switchTo(l: AdminLocale) {
    // 写 cookie 是浏览器 API 赋值，非状态修改
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `admin_locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }
  return (
    <div className="flex gap-1 px-2">
      {ADMIN_LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`rounded px-2 py-1 text-xs ${l === current ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-200"}`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
