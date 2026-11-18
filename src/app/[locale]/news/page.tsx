import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getNewsPage } from "@/lib/data";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/motion/Reveal";
import { NewsCard } from "@/components/site/Cards";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const page = Math.max(1, Number((await searchParams).page ?? 1) || 1);
  const { items, totalPages } = await getNewsPage(page);

  return (
    <div>
      <PageHero title={t("news.title")} subtitle={t("news.subtitle")} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-12 text-center text-zinc-500">{t("common.noContent")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n, i) => (
              <Reveal key={n.id} delay={(i % 3) * 0.08}><NewsCard item={n} locale={locale} /></Reveal>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Pagination">
            {page > 1 && (
              <Link href={`/news?page=${page - 1}`} className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm hover:border-cyber">
                <ChevronLeft size={15} className="rtl:rotate-180" /> {t("common.prevPage")}
              </Link>
            )}
            <span className="text-sm text-zinc-400">{page} / {totalPages}</span>
            {page < totalPages && (
              <Link href={`/news?page=${page + 1}`} className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm hover:border-cyber">
                {t("common.nextPage")} <ChevronRight size={15} className="rtl:rotate-180" />
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
