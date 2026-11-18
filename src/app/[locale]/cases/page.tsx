import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCases } from "@/lib/data";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/motion/Reveal";
import { CaseCard } from "@/components/site/Cards";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const cases = await getCases();
  return (
    <div>
      <PageHero title={t("cases.title")} subtitle={t("cases.subtitle")} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {cases.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-12 text-center text-zinc-500">{t("common.noContent")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 0.08}><CaseCard item={c} locale={locale} viewLabel={t("common.viewDetails")} /></Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
