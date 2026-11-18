import type { Metadata } from "next";
import { Inter, Space_Grotesk, Tajawal } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isRtl, type Locale } from "@/i18n/routing";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { ScrollProgress } from "@/components/motion/ScrollFx";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"], display: "swap" });
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic"], weight: ["400", "500", "700"], display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: { default: `AIQC — ${t("title")}${t("titleAccent")}`, template: "%s | AIQC" },
    description: t("subtitle"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const rtl = isRtl(locale);
  return (
    <html lang={locale === "zh" ? "zh-CN" : locale} dir={rtl ? "rtl" : "ltr"} className={`${inter.variable} ${space.variable} ${tajawal.variable}`}>
      <body className="flex min-h-screen flex-col bg-abyss">
        <NextIntlClientProvider>
          <Header />
          <ScrollProgress rtl={rtl} />
          <main className="flex-1 pt-16">{children}</main>
          <Footer locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
