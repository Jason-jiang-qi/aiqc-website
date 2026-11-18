import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ShoppingCart, Cog, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProducts, getCases } from "@/lib/data";
import { db } from "@/lib/db";
import { pick } from "@/lib/i18n-content";
import { siteConfig } from "@/lib/site-config";
import HeroCanvas from "@/components/site/HeroCanvas";
import HeroVisual from "@/components/site/HeroVisual";
import StickyProductStory from "@/components/site/StickyProductStory";
import Reveal from "@/components/motion/Reveal";
import { ScrollFade, WordReveal, Tilt } from "@/components/motion/ScrollFx";
import CountUp from "@/components/motion/CountUp";
import { CaseCard, NewsCard } from "@/components/site/Cards";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [products, cases, news] = await Promise.all([
    getProducts(),
    getCases(),
    db.news.findMany({ where: { isPublished: true }, orderBy: { publishDate: "desc" }, take: 3 }),
  ]);
  const featuredCases = cases.filter((c) => c.featured).slice(0, 3);
  const showcase = products.slice(0, 6).map((p) => ({
    slug: p.slug,
    title: pick(p, locale, "Title"),
    desc: pick(p, locale, "Desc"),
    cover: p.cover,
  }));
  const stats = [
    { value: siteConfig.stats.years, suffix: "+", label: t("home.statsYears") },
    { value: siteConfig.stats.clients, suffix: "+", label: t("home.statsClients") },
    { value: siteConfig.stats.devices, suffix: "+", label: t("home.statsDevices") },
    { value: siteConfig.stats.cities, suffix: "+", label: t("home.statsCities") },
  ];

  return (
    <div className="overflow-x-clip">
      {/* ===== Hero：全屏大字 + 视差视觉 ===== */}
      <section className="bg-grid relative flex min-h-svh items-center overflow-hidden">
        <HeroCanvas />
        <span className="text-outline pointer-events-none absolute -bottom-10 start-0 select-none whitespace-nowrap font-display text-[22vw] font-black leading-none" aria-hidden>
          AIQC
        </span>
        <div className="pointer-events-none absolute -top-40 start-1/4 size-[34rem] rounded-full bg-royal/25 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 end-0 size-[28rem] rounded-full bg-cyber/15 blur-[130px]" />
        <ScrollFade className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-24 sm:px-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/10 px-4 py-1.5 text-sm text-cyber">
              <MapPin size={14} /> {t("hero.badge")}
            </span>
            {/* 两行：前半句 + 后半句；PC 端每行完整显示，不再拆成多句 */}
            <h1 className="mt-7 font-display text-4xl font-black leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
              <span className="block lg:whitespace-nowrap">{t("hero.title")}</span>
              <span className="text-gradient animate-gradient mt-1 block pb-1 lg:whitespace-nowrap">{t("hero.titleAccent")}</span>
            </h1>
          </Reveal>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal delay={0.05}>
              <p className="max-w-xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">{t("hero.subtitle")}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/products" className="group rounded-full bg-gradient-to-r from-cyber to-royal px-8 py-4 font-semibold text-abyss shadow-[0_10px_40px_-10px_rgba(0,212,255,0.7)] transition hover:shadow-[0_10px_50px_-6px_rgba(0,212,255,0.9)]">
                  {t("hero.ctaProducts")}
                </Link>
                <Link href="/contact" className="rounded-full border border-white/25 px-8 py-4 font-medium text-white backdrop-blur transition hover:bg-white/10">
                  {t("hero.ctaContact")}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="hidden md:block">
              <HeroVisual chips={[t("hero.chip1"), t("hero.chip2"), t("hero.chip3")]} status={t("hero.hudStatus")} />
            </Reveal>
          </div>
        </ScrollFade>
        <div className="absolute bottom-6 start-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs tracking-widest text-zinc-500 rtl:translate-x-1/2">
          {t("hero.scroll")}
          <ChevronDown className="animate-bounce text-cyber" size={17} />
        </div>
      </section>

      {/* ===== 滚动字带 ===== */}
      <div className="relative -rotate-1 border-y border-cyber/20 bg-gradient-to-r from-royal/25 via-cyber/15 to-mint/15 py-3.5" aria-hidden>
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center">
              {showcase.map((p) => (
                <span key={p.slug} className="flex items-center font-display text-lg font-semibold tracking-wide text-white/90">
                  <span className="px-6">{p.title}</span>
                  <Sparkles size={15} className="text-cyber" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ===== 旗舰产品：苹果式粘性滚动叙事 ===== */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
          <Reveal>
            <SectionHead index="01" title={t("home.productsTitle")} href="/products" viewAll={t("common.viewAll")} />
          </Reveal>
        </div>
        <StickyProductStory items={showcase} label={t("hero.showcaseLabel")} viewLabel={t("common.viewDetails")} />
        {products.length === 0 && <div className="mx-auto max-w-7xl px-4 sm:px-6"><Empty text={t("common.noContent")} /></div>}
      </section>

      {/* ===== 简介 + 玻璃统计 ===== */}
      <section className="relative overflow-hidden border-y border-line bg-panel/50">
        <span className="text-outline pointer-events-none absolute -top-6 end-0 select-none font-display text-[11rem] font-black leading-none" aria-hidden>SAUDI</span>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <p className="font-display text-sm tracking-[0.3em] text-cyber">02 — AIQC</p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-snug text-white sm:text-5xl">{t("home.aboutTitle")}</h2>
            </Reveal>
            <WordReveal text={t("home.aboutText")} className="text-lg leading-9 text-zinc-200" />
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="glass group rounded-3xl p-7 text-center transition hover:border-cyber/40">
                  <p className="font-display text-5xl font-black text-gradient"><CountUp value={s.value} suffix={s.suffix} /></p>
                  <p className="mt-2 text-sm text-zinc-400">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 核心业务：横向大卡 ===== */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal><SectionHead index="03" title={t("home.businessTitle")} /></Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { icon: ShoppingCart, title: t("home.biz1Title"), desc: t("home.biz1Desc"), no: "A" },
            { icon: Cog, title: t("home.biz2Title"), desc: t("home.biz2Desc"), no: "B" },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1}>
              <Tilt className="h-full">
              <div className="card-glow group relative h-full overflow-hidden rounded-[2rem] border border-line bg-panel p-9 sm:p-11">
                <span className="text-outline pointer-events-none absolute -end-2 -top-7 select-none font-display text-[8rem] font-black" aria-hidden>{b.no}</span>
                <b.icon className="relative text-cyber transition group-hover:scale-110" size={44} strokeWidth={1.4} />
                <h3 className="relative mt-6 font-display text-3xl font-bold text-white">{b.title}</h3>
                <p className="relative mt-3 max-w-md text-lg leading-8 text-zinc-400">{b.desc}</p>
              </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== 成功案例 ===== */}
      {(featuredCases.length > 0 || cases.length > 0) && (
        <section className="border-y border-line bg-panel/50">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
            <Reveal><SectionHead index="04" title={t("home.casesTitle")} href="/cases" viewAll={t("common.viewAll")} /></Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(featuredCases.length ? featuredCases : cases.slice(0, 3)).map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}><Tilt><CaseCard item={c} locale={locale} viewLabel={t("common.viewDetails")} /></Tilt></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 新闻 ===== */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal><SectionHead index="05" title={t("home.newsTitle")} href="/news" viewAll={t("common.viewAll")} /></Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.08}><Tilt><NewsCard item={n} locale={locale} /></Tilt></Reveal>
          ))}
        </div>
        {news.length === 0 && <Empty text={t("common.noContent")} />}
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
        <Reveal>
          <div className="bg-grid relative overflow-hidden rounded-[2.5rem] border border-cyber/25 bg-gradient-to-br from-royal/30 via-panel-2 to-abyss px-8 py-16 text-center sm:py-20">
            <div className="pointer-events-none absolute -top-24 start-1/3 size-72 rounded-full bg-cyber/25 blur-[100px]" />
            <h2 className="relative mx-auto max-w-2xl font-display text-4xl font-bold leading-snug text-white sm:text-5xl">{t("home.ctaTitle")}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-zinc-300">{t("home.ctaText")}</p>
            <Link href="/contact" className="relative mt-10 inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 font-semibold text-abyss shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] transition hover:bg-cyber">
              {t("common.consultNow")} <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function SectionHead({ index, title, href, viewAll }: { index: string; title: string; href?: string; viewAll?: string }) {
  return (
    <div className="mb-12 flex items-end justify-between gap-4">
      <h2 className="flex items-baseline gap-4 font-display text-4xl font-bold text-white sm:text-5xl">
        <span className="text-lg font-semibold text-cyber">{index}</span>
        {title}
        <span className="hidden h-px w-24 self-center bg-gradient-to-r from-cyber/60 to-transparent sm:block rtl:-scale-x-100" />
      </h2>
      {href && viewAll && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm text-cyber hover:underline">
          {viewAll} <ArrowRight size={15} className="rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-line p-10 text-center text-zinc-500">{text}</p>;
}
