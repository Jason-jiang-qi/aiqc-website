import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import * as icons from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProductBySlug } from "@/lib/data";
import { pick, triText, parseFeatures, parseSpecs, parseScenarios, parseImages } from "@/lib/i18n-content";
import Gallery from "@/components/site/Gallery";
import RichContent from "@/components/rich/RichContent";
import Reveal from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getProductBySlug(slug);
  if (!item) return {};
  const loc = locale as Locale;
  return { title: pick(item, loc, "Title"), description: pick(item, loc, "Desc") };
}

export default async function ProductDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const item = await getProductBySlug(slug);
  if (!item) notFound();

  const title = pick(item, locale, "Title");
  const images = [item.cover, ...parseImages(item.images)].filter((x): x is string => Boolean(x));
  const features = parseFeatures(item.features);
  const specs = parseSpecs(item.specs);
  const scenarios = parseScenarios(item.scenarios);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="grid gap-10 lg:grid-cols-2">
          <Gallery images={images} title={title} />
          <div>
            {item.featured && <span className="rounded-full bg-cyber/15 px-3 py-1 text-xs text-cyber">{t("featured")}</span>}
            <h1 className="mt-3 font-display text-4xl font-bold text-white">{title}</h1>
            <p className="mt-4 leading-8 text-zinc-400">{pick(item, locale, "Desc")}</p>
            <Link
              href={`/contact?product=${item.slug}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber to-royal px-7 py-3.5 font-medium text-abyss hover:opacity-90"
            >
              {t("consultProduct")} <ArrowRight size={17} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </Reveal>

      {features.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white">{t("features")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = (icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[f.icon] ?? Zap;
              return (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-panel p-5">
                  <Icon className="mt-0.5 shrink-0 text-cyber" size={22} />
                  <p className="text-sm leading-6 text-zinc-300">{triText(f.text, locale)}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-14"><RichContent html={pick(item, locale, "Body")} /></section>

      {specs.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white">{t("specs")}</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-sm">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className={i % 2 ? "bg-panel" : "bg-panel/50"}>
                    <th className="w-1/3 px-5 py-3.5 text-start font-medium text-zinc-300">{triText(s.label, locale)}</th>
                    <td className="px-5 py-3.5 text-zinc-400">{triText(s.value, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {scenarios.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white">{t("scenarios")}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {scenarios.map((s, i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl border border-line bg-panel px-5 py-4 text-zinc-300">
                <CheckCircle2 className="shrink-0 text-mint" size={18} /> {triText(s, locale)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
