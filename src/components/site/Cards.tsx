import Image from "next/image";
import { ArrowRight, Bot } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pick, formatDate } from "@/lib/i18n-content";
import type { Product, Case, News } from "@prisma/client";

function Cover({ src, title }: { src?: string | null; title: string }) {
  if (src)
    return <Image src={src} alt={title} width={800} height={500} className="h-48 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />;
  // 无图占位：科技渐变 + 产品名首字（正式素材由公司提供后在后台上传）
  return (
    <div className="bg-grid relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-panel-2 via-abyss to-royal/30">
      <div className="absolute -end-8 -top-8 size-36 rounded-full bg-cyber/20 blur-3xl" />
      <Bot className="text-cyber/70" size={54} />
      <span className="absolute bottom-3 px-4 text-center text-sm text-zinc-400">{title}</span>
    </div>
  );
}

export function ProductCard({ item, locale, viewLabel, featuredLabel }: { item: Product; locale: Locale; viewLabel: string; featuredLabel: string }) {
  const title = pick(item, locale, "Title");
  return (
    <Link href={`/products/${item.slug}`} className="card-glow group overflow-hidden rounded-2xl border border-line bg-panel">
      <Cover src={item.cover} title={title} />
      <div className="p-5">
        {item.featured && <span className="mb-2 inline-block rounded-full bg-cyber/15 px-2.5 py-0.5 text-xs text-cyber">{featuredLabel}</span>}
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">{pick(item, locale, "Desc")}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyber">{viewLabel} <ArrowRight size={15} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" /></span>
      </div>
    </Link>
  );
}

export function CaseCard({ item, locale, viewLabel }: { item: Case; locale: Locale; viewLabel: string }) {
  const title = pick(item, locale, "Title");
  return (
    <Link href={`/cases/${item.slug}`} className="card-glow group overflow-hidden rounded-2xl border border-line bg-panel">
      <Cover src={item.cover} title={title} />
      <div className="p-5">
        <p className="text-xs text-cyber">{pick(item, locale, "Client")}</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">{pick(item, locale, "Desc")}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyber">{viewLabel} <ArrowRight size={15} className="rtl:rotate-180" /></span>
      </div>
    </Link>
  );
}

export function NewsCard({ item, locale }: { item: News; locale: Locale }) {
  const title = pick(item, locale, "Title");
  return (
    <Link href={`/news/${item.slug}`} className="card-glow group overflow-hidden rounded-2xl border border-line bg-panel">
      <Cover src={item.cover} title={title} />
      <div className="p-5">
        <time className="text-xs text-zinc-500">{formatDate(item.publishDate, locale)}</time>
        <h3 className="mt-1 font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">{pick(item, locale, "Summary")}</p>
      </div>
    </Link>
  );
}

export { Cover };
