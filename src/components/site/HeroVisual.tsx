"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Bot, Radar, BatteryCharging, Truck, ScanLine } from "lucide-react";

/** Hero 右侧沉浸式视觉：鼠标视差 + 雷达旋转 + 悬浮 HUD 芯片（纯代码绘制，无图片依赖） */
export default function HeroVisual({ chips, status }: { chips: string[]; status: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const orbX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const orbY = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const backX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const backY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  const chipIcons = [Radar, ScanLine, BatteryCharging];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" onMouseMove={onMove} aria-hidden>
      {/* 雷达同心环 + 扫描扇面 */}
      <motion.div style={{ x: backX, y: backY }} className="absolute inset-0">
        <div className="absolute inset-0 rounded-full border border-cyber/15" />
        <div className="absolute inset-[13%] rounded-full border border-royal/20" />
        <div className="absolute inset-[27%] rounded-full border border-dashed border-cyber/25" />
        <div className="animate-spin-slow absolute inset-[13%] rounded-full bg-[conic-gradient(from_0deg,rgba(0,212,255,0.22),transparent_70deg,transparent)]" />
        {/* 十字准线 */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyber/15 to-transparent" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-cyber/15 to-transparent" />
      </motion.div>

      {/* 中央发光主体 */}
      <motion.div style={{ x: orbX, y: orbY }} className="absolute inset-[31%]">
        <div className="glass relative grid h-full w-full place-items-center rounded-[2rem] shadow-[0_0_90px_-18px_rgba(0,212,255,0.65)]">
          <div className="animate-scan absolute start-3 end-3 h-10 bg-gradient-to-b from-transparent via-cyber/25 to-transparent" />
          <Bot className="text-cyber drop-shadow-[0_0_18px_rgba(0,212,255,0.8)]" size={92} strokeWidth={1.2} />
          <Truck className="absolute bottom-4 text-royal/70" size={26} />
        </div>
      </motion.div>

      {/* 悬浮 HUD 芯片 */}
      {chips.map((chip, i) => {
        const Icon = chipIcons[i % chipIcons.length];
        const pos = [
          "start-0 top-[10%]",
          "end-0 top-[36%] [animation-delay:1.2s]",
          "start-[6%] bottom-[8%] [animation-delay:2.1s]",
        ][i];
        return (
          <div key={chip} className={`glass animate-float absolute ${pos} flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-cyan-100 sm:text-sm`}>
            <Icon size={15} className="text-cyber" /> {chip}
          </div>
        );
      })}

      {/* 底部状态条 */}
      <div className="glass absolute bottom-[2%] start-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs text-emerald-300 rtl:translate-x-1/2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        {status}
      </div>
    </div>
  );
}
