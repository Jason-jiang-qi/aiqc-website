import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrendingUp } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getCaseBySlug } from "@/lib/data";
import { pick, triText, parseMetrics, parseImages } from "@/lib/i18n-content";
import Gallery from "@/components/site/Gallery";
import RichContent from "@/components/rich/RichContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getCaseBySlug(slug);
  if (!item) return {};
  const loc = locale as Locale;
  return { title: pick(item, loc, "Title"), description: pick(item, loc, "Desc") };
}

export default async function CaseDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const item = await getCaseBySlug(slug);
  if (!item) notFound();
  const title = pick(item, locale, "Title");
  const images = [item.cover, ...parseImages(item.images)].filter((x): x is string => Boolean(x));
  const metrics = parseMetrics(item.metrics);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-sm text-cyber">{t("client")}：{pick(item, locale, "Client")}</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-white">{title}</h1>
      <p className="mt-4 leading-8 text-zinc-400">{pick(item, locale, "Desc")}</p>

      {metrics.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white"><TrendingUp className="text-mint" /> {t("results")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <div key={i} className="rounded-2xl border border-line bg-panel p-6 text-center">
                <p className="font-display text-3xl font-bold text-gradient">{m.value}</p>
                <p className="mt-2 text-sm text-zinc-400">{triText(m.label, locale)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12"><RichContent html={pick(item, locale, "Body")} /></section>
      <section className="mt-12"><Gallery images={images} title={title} /></section>
    </div>
  );
}
