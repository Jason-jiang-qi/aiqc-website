"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight, Bot, Brush, Package, Truck, Dog, BatteryCharging } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ShowcaseItem } from "./ProductShowcase";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  "autonomous-sweeper": Brush,
  "autonomous-delivery": Package,
  "autonomous-truck": Truck,
  "robot-dog": Dog,
  "service-robot": Bot,
  "mobile-charging": BatteryCharging,
};

/**
 * 苹果式粘性滚动叙事：产品主图作整屏背景，文字叠在左侧（不与图片分栏抢位）
 */
export default function StickyProductStory({
  items, label, viewLabel,
}: {
  items: ShowcaseItem[];
  label: string;
  viewLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length)));
    setActive(idx);
  });

  if (items.length === 0) return null;

  const item = items[active];
  const Icon = ICONS[item.slug] ?? Bot;

  if (reduce) {
    return (
      <div className="relative min-h-[70vh] overflow-hidden rounded-[2rem] border border-line">
        {item.cover ? (
          <Image src={item.cover} alt={item.title} fill className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-panel-2 to-royal/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/75 to-abyss/20" />
        <div className="relative z-10 flex min-h-[70vh] items-center px-8 py-16 sm:px-12">
          <div className="max-w-xl">
            <h3 className="font-display text-4xl font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-zinc-300">{item.desc}</p>
            <Link href={`/products/${item.slug}`} className="mt-6 inline-flex items-center gap-1 text-cyber">
              {viewLabel} <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: `${items.length * 62}vh` }}>
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        {/* 全幅背景主图 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {item.cover ? (
              <Image
                src={item.cover}
                alt=""
                fill
                priority={active === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            ) : (
              <div className="bg-grid absolute inset-0 flex items-center justify-center bg-gradient-to-br from-panel-2 via-abyss to-royal/40">
                <Icon className="text-cyber/40" size={180} strokeWidth={0.8} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 遮罩：保证左侧文字可读，右侧露出产品图 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-abyss via-abyss/80 to-abyss/15 rtl:bg-gradient-to-l" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent to-abyss/40" />

        <span className="text-outline pointer-events-none absolute -end-4 top-6 select-none font-display text-[11rem] font-black leading-none sm:text-[17rem]" aria-hidden>
          {String(active + 1).padStart(2, "0")}
        </span>

        {/* 文字层：单列叠在背景上，不与图片分栏 */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6">
          <div className="w-full max-w-xl lg:max-w-2xl">
            <p className="text-sm font-medium tracking-[0.35em] text-cyber">{label}</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              >
                <h3 className="mt-4 font-display text-5xl font-black leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] sm:text-6xl">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-lg text-xl leading-9 text-zinc-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                  {item.desc}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-abyss transition hover:bg-cyber"
                >
                  {viewLabel} <ArrowUpRight size={18} className="rtl:-scale-x-100" />
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex gap-2">
              {items.map((p, i) => (
                <button
                  key={p.slug}
                  aria-label={p.title}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-14 bg-cyber" : "w-6 bg-white/25 hover:bg-white/45"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
