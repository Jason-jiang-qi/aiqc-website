"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Bot } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type ShowcaseItem = { slug: string; title: string; desc: string; cover?: string | null };

const GRADIENTS = [
  "from-cyan-500/25 via-blue-600/10 to-transparent",
  "from-violet-500/25 via-blue-600/10 to-transparent",
  "from-emerald-400/20 via-cyan-600/10 to-transparent",
  "from-blue-500/25 via-indigo-600/10 to-transparent",
  "from-fuchsia-500/20 via-blue-600/10 to-transparent",
  "from-teal-400/20 via-cyan-600/10 to-transparent",
];

/** 旗舰产品沉浸式展示：点击序号切换大图区（优先展示真实主图） */
export default function ProductShowcase({
  items, label, viewLabel,
}: {
  items: ShowcaseItem[];
  label: string;
  viewLabel: string;
}) {
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;
  const item = items[active];
  return (
    <div>
      <div className="relative overflow-hidden rounded-[2rem] border border-line">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`bg-grid relative bg-gradient-to-br ${GRADIENTS[active % GRADIENTS.length]} bg-panel`}
          >
            {item.cover ? (
              <Image src={item.cover} alt={item.title} width={1400} height={700} className="absolute inset-0 h-full w-full object-cover opacity-35" />
            ) : (
              <Bot className="pointer-events-none absolute bottom-8 end-10 hidden text-white/8 sm:block" size={190} strokeWidth={0.7} />
            )}
            <div className="relative px-7 py-12 sm:px-12 sm:py-16">
            <span className="text-outline pointer-events-none absolute -top-4 end-4 select-none font-display text-[9rem] font-black leading-none sm:text-[13rem]">
              {String(active + 1).padStart(2, "0")}
            </span>
            <p className="text-sm font-medium tracking-[0.3em] text-cyber">{label}</p>
            <h3 className="mt-4 max-w-xl font-display text-4xl font-bold text-white sm:text-5xl">{item.title}</h3>
            <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-300">{item.desc}</p>
            <Link
              href={`/products/${item.slug}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-abyss transition hover:bg-cyber"
            >
              {viewLabel} <ArrowUpRight size={17} className="rtl:-scale-x-100" />
            </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 序号选择器 */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {items.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => setActive(i)}
            className={`rounded-xl border px-3 py-3 text-start transition ${
              i === active ? "border-cyber/60 bg-cyber/10" : "border-line bg-panel hover:border-white/25"
            }`}
          >
            <span className={`font-display text-xs ${i === active ? "text-cyber" : "text-zinc-500"}`}>{String(i + 1).padStart(2, "0")}</span>
            <span className={`mt-1 line-clamp-1 block text-sm ${i === active ? "text-white" : "text-zinc-400"}`}>{p.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
