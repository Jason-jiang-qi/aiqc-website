import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en", "ar"],
  defaultLocale: "zh",
  // 中文无前缀（/），英文 /en，阿语 /ar —— 利于 SEO 与链接分享
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
export const isRtl = (locale: string) => locale === "ar";
