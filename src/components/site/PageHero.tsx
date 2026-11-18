import Reveal from "@/components/motion/Reveal";

export default function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-grid relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute -top-24 start-1/3 size-72 rounded-full bg-royal/20 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-lg text-zinc-400">{subtitle}</p>}
        </Reveal>
      </div>
    </div>
  );
}
