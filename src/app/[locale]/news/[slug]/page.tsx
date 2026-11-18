import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getNewsBySlug, getNewsNeighbors } from "@/lib/data";
import { pick, formatDate } from "@/lib/i18n-content";
import { Cover } from "@/components/site/Cards";
import RichContent from "@/components/rich/RichContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  const loc = locale as Locale;
  return { title: pick(item, loc, "Title"), description: pick(item, loc, "Summary") };
}

export default async function NewsDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const item = await getNewsBySlug(slug);
  if (!item) notFound();
  const { prev, next } = await getNewsNeighbors(item.publishDate, item.id);

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link href="/news" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-cyber">
        <ArrowLeft size={15} className="rtl:rotate-180" /> {t("back")}
      </Link>
      <h1 className="mt-5 font-display text-4xl font-bold leading-snug text-white">{pick(item, locale, "Title")}</h1>
      <time className="mt-3 block text-sm text-zinc-500">{formatDate(item.publishDate, locale)}</time>
      {item.cover && <div className="mt-8 overflow-hidden rounded-2xl border border-line"><Cover src={item.cover} title="" /></div>}
      <div className="mt-10"><RichContent html={pick(item, locale, "Body")} /></div>

      <nav className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-8">
        {prev ? (
          <Link href={`/news/${prev.slug}`} className="group max-w-[45%]">
            <span className="text-xs text-zinc-500">{t("prevArticle")}</span>
            <span className="mt-1 block truncate text-sm text-zinc-300 group-hover:text-cyber">{pick(prev, locale, "Title")}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/news/${next.slug}`} className="group max-w-[45%] text-end">
            <span className="text-xs text-zinc-500">{t("nextArticle")}</span>
            <span className="mt-1 flex items-center justify-end gap-1 truncate text-sm text-zinc-300 group-hover:text-cyber">
              {pick(next, locale, "Title")} <ArrowRight size={14} className="shrink-0 rtl:rotate-180" />
            </span>
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}
