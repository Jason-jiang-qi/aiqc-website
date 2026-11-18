"use client";

import { useState } from "react";
import Image from "next/image";
import { Bot } from "lucide-react";

/** 产品/案例多图切换图库 */
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="bg-grid relative flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-panel-2 via-abyss to-royal/30">
        <div className="absolute -end-10 -top-10 size-44 rounded-full bg-cyber/20 blur-3xl" />
        <Bot className="text-cyber/70" size={72} />
        <span className="absolute bottom-4 text-zinc-400">{title}</span>
      </div>
    );
  }
  return (
    <div>
      <Image src={images[active]} alt={title} width={1200} height={700} className="h-80 w-full rounded-2xl border border-line object-cover sm:h-[420px]" priority />
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button key={src + i} onClick={() => setActive(i)} className={`shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? "border-cyber" : "border-transparent opacity-60"}`}>
              <Image src={src} alt="" width={160} height={100} className="h-16 w-24 object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
