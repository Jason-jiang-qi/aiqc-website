import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Target, Eye, HeartHandshake, MapPinned } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("intro") };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const home = await getTranslations("home");
  const cards = [
    { icon: Target, title: t("missionTitle"), text: t("mission") },
    { icon: Eye, title: t("visionTitle"), text: t("vision") },
    { icon: HeartHandshake, title: t("valuesTitle"), text: [t("v1"), t("v2"), t("v3")].join("\n") },
    { icon: MapPinned, title: t("localTitle"), text: t("localText") },
  ];
  const stats = [
    { value: siteConfig.stats.years, label: home("statsYears") },
    { value: siteConfig.stats.clients, label: home("statsClients") },
    { value: siteConfig.stats.devices, label: home("statsDevices") },
    { value: siteConfig.stats.cities, label: home("statsCities") },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{t("title")}</h1>
        <h2 className="mt-10 font-display text-2xl font-semibold text-white">{t("introTitle")}</h2>
        <p className="mt-4 max-w-3xl leading-8 text-zinc-400">{t("intro")}</p>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-panel p-6 text-center">
            <p className="font-display text-4xl font-bold text-gradient"><CountUp value={s.value} suffix="+" /></p>
            <p className="mt-2 text-sm text-zinc-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.07}>
            <div className="card-glow h-full rounded-2xl border border-line bg-panel p-8">
              <c.icon className="text-cyber" size={32} />
              <h3 className="mt-4 font-display text-xl font-semibold text-white">{c.title}</h3>
              <p className="mt-2 whitespace-pre-line leading-7 text-zinc-400">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
