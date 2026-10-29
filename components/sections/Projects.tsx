'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { projects, type Category, type Project } from '@/lib/data';
import { BorderBeam, BrowserFrame, PhoneFrame } from '@/components/ui/Effects';
import SectionHead from './SectionHead';

const FILTERS: ('All' | Category)[] = ['All', 'AI', 'Enterprise', 'E-commerce', 'Open source'];

// Tilts toward the pointer and lights up underneath it.
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = `perspective(1000px) rotateX(${(y / r.height - 0.5) * -5}deg) rotateY(${(x / r.width - 0.5) * 5}deg)`;
    }
  };
  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return { ref, onPointerMove, onPointerLeave };
}

function Visual({ p, big }: { p: Project; big?: boolean }) {
  const mobile = p.gallery.find((g) => g.mobile);
  if (p.cover) {
    return (
      <div className="relative">
        <BrowserFrame url={p.live}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={p.cover} alt={`${p.title} screenshot`} fill sizes="(max-width: 900px) 100vw, 640px" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
          </div>
        </BrowserFrame>
        {big && mobile && (
          <PhoneFrame className="absolute -bottom-6 -right-3 w-[26%] max-md:hidden">
            <div className="relative aspect-[390/844]">
              <Image src={mobile.src} alt={mobile.alt} fill sizes="180px" className="object-cover object-top" />
            </div>
          </PhoneFrame>
        )}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-void/80 font-mono text-[12.5px] leading-relaxed">
      <div className="flex items-center justify-between border-b border-edge px-3.5 py-2 text-[11px] text-dim">
        <span>{p.repo ? p.repo.replace('https://github.com/', '') : 'demo/Authentication'}</span>
        <span style={{ color: p.accent }}>● main</span>
      </div>
      <pre className="overflow-x-auto p-4 text-soft"><code>{p.code}</code></pre>
    </div>
  );
}

function Card({ p, index }: { p: Project; index: number }) {
  const tilt = useTilt();
  const feature = index === 0;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className={`min-w-0 ${feature ? "md:col-span-2" : ""}`}
    >
      <div
        {...tilt}
        className={`group relative h-full rounded-[22px] glass p-5 transition-[border-color,transform] duration-200 hover:border-edge-hot md:p-7 ${feature ? 'grid gap-8 md:grid-cols-[1fr_1.15fr] md:items-center md:p-9' : 'flex flex-col gap-6'}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(460px circle at var(--mx) var(--my), ${p.accent}22, transparent 45%)` }} />
        {feature && <BorderBeam size={220} duration={8} />}

        <div className={`relative flex min-w-0 flex-col gap-3.5 ${feature ? 'md:order-1' : 'order-2'}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-amber">{p.kind}</span>
            {p.live && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint">
                <span className="size-1.5 animate-pulse rounded-full bg-mint" /> LIVE
              </span>
            )}
          </div>
          <h3 className={`font-display font-bold leading-[1.08] tracking-tight ${feature ? 'text-[clamp(1.9rem,3.6vw,2.7rem)]' : 'text-[clamp(1.4rem,2.6vw,1.8rem)]'}`}>{p.title}</h3>
          <p className="text-soft">{p.summary}</p>
          {p.metrics && feature && (
            <div className="mt-1 grid grid-cols-3 gap-3">
              {p.metrics.map((m) => (
                <div key={m.label} className="border-t-2 pt-2.5" style={{ borderColor: p.accent }}>
                  <b className="block font-display text-xl tabular-nums md:text-2xl">{m.value}</b>
                  <small className="text-xs text-dim">{m.label}</small>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {p.stack.slice(0, feature ? 8 : 5).map((s) => (
              <span key={s} className="rounded-md border border-edge bg-white/[.02] px-2.5 py-1 font-mono text-[11px] text-[#A9B6D6]">{s}</span>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
            <Link href={`/projects/${p.slug}/`} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-void transition hover:bg-cyan">
              Case study <span aria-hidden="true">→</span>
            </Link>
            {(p.live || p.repo) && (
              <a href={p.live ?? p.repo} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-cyan underline decoration-dashed decoration-edge-hot underline-offset-4 hover:text-ink">
                {p.live ? 'Visit live' : 'View code'} ↗
              </a>
            )}
          </div>
        </div>
        <div className={`relative min-w-0 ${feature ? 'md:order-2' : 'order-1'}`}>
          <Visual p={p} big={feature} />
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const shown = projects.filter((p) => filter === 'All' || p.categories.includes(filter));

  return (
    <section id="work" className="mx-auto max-w-[1120px] px-5 pb-10 pt-28 md:px-8">
      <SectionHead eyebrow="Selected work" title={<>Live in <span className="text-grad">production.</span></>} text="Products I designed, built and deployed end to end. Open any card for the full case study." />

      <div role="tablist" aria-label="Filter projects" className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`relative rounded-full px-4 py-2 font-mono text-[13px] transition-colors ${filter === f ? 'text-void' : 'text-dim hover:text-ink'}`}
          >
            {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 -z-10 rounded-full bg-cyan" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            {f}
            <span className="ml-1.5 opacity-60">{f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <Card key={p.slug} p={p} index={filter === 'All' ? i : i + 1} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
