import { getAdminLocale } from "@/i18n/admin";
import "../globals.css";

/** 后台独立根布局（不共用前台 [locale] 的 html，避免双根冲突） */
export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getAdminLocale();
  return (
    <html lang={locale === "zh" ? "zh-CN" : locale} dir={locale === "ar" ? "rtl" : "ltr"} className="h-full">
      <body className="min-h-full bg-zinc-100 font-sans text-zinc-900">{children}</body>
    </html>
  );
}
