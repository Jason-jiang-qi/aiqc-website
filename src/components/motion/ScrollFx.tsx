"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/** 顶部阅读进度条（苹果发布会页同款细线） */
export function ScrollProgress({ rtl = false }: { rtl?: boolean }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  return (
    <motion.div
      className="fixed inset-x-0 top-16 z-40 h-[3px] origin-left bg-gradient-to-r from-cyber via-royal to-mint"
      style={{ scaleX, transformOrigin: rtl ? "right" : "left" }}
      aria-hidden
    />
  );
}

/** 滚动时缩放淡出（Hero 离场效果） */
export function ScrollFade({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 620], [1, 0]);
  const scale = useTransform(scrollY, [0, 620], [1, 0.93]);
  const y = useTransform(scrollY, [0, 620], [0, 90]);
  if (reduce) return <div className={className}>{children}</div>;
  return <motion.div className={className} style={{ opacity, scale, y }}>{children}</motion.div>;
}

/** 逐词显现文案：滚动进入时词语依次由暗变亮（中文按字、其他按词） */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.42"] });
  const tokens = /\s/.test(text.trim()) ? text.split(/\s+/) : Array.from(text);
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className} aria-label={text}>
      {tokens.map((token, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / tokens.length, (i + 1) / tokens.length]} text={token} spaced={/\s/.test(text)} />
      ))}
    </p>
  );
}

function Word({ progress, range, text, spaced }: { progress: MotionValue<number>; range: [number, number]; text: string; spaced: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block" aria-hidden>
      {text}
      {spaced ? "\u00A0" : ""}
    </motion.span>
  );
}

/** 悬浮倾斜卡（鼠标移动时 3D 倾斜，苹果产品卡质感） */
export function Tilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 160, damping: 18 });
  const ry = useSpring(0, { stiffness: 160, damping: 18 });
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  }
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
}
