import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, Mail, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getProducts } from "@/lib/data";
import { pick } from "@/lib/i18n-content";
import { siteConfig } from "@/lib/site-config";
import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/site/ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const products = (await getProducts()).map((p) => ({ slug: p.slug, title: pick(p, locale, "Title") }));
  const { product } = await searchParams;

  return (
    <div>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="font-display text-xl font-semibold text-white">{t("infoTitle")}</h2>
          <div className="mt-5 space-y-4 text-sm text-zinc-400">
            <p className="flex items-center gap-3"><Phone className="text-cyber" size={17} /> {t("phone")}：{siteConfig.contact.phone}</p>
            <p className="flex items-center gap-3"><Mail className="text-cyber" size={17} /> {t("email")}：{siteConfig.contact.email}</p>
            <p className="flex items-center gap-3"><MapPin className="text-cyber" size={17} /> {t("address")}：{siteConfig.contact.address[locale]}</p>
          </div>
          {/* 地图嵌入待公司地址确认后接入（需求 §5.6 可选） */}
        </div>
        <ContactForm products={products} defaultProduct={product ?? ""} />
      </div>
    </div>
  );
}
