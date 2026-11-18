import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getProducts } from "@/lib/data";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/motion/Reveal";
import { ProductCard } from "@/components/site/Cards";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const products = await getProducts();
  return (
    <div>
      <PageHero title={t("products.title")} subtitle={t("products.subtitle")} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-12 text-center text-zinc-500">{t("common.noContent")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <ProductCard item={p} locale={locale} viewLabel={t("common.viewDetails")} featuredLabel={t("common.featured")} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
