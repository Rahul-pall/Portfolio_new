import { marquee } from '@/lib/data';

export default function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <div className="relative overflow-hidden border-y border-edge bg-deep/60 py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-label="Technologies I use">
      <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-xl font-semibold text-dim/70 md:text-2xl" aria-hidden={i >= marquee.length}>
            {t}
            <span className="text-cyan">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
