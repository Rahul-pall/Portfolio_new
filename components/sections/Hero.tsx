'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'motion/react';
import Scramble from '@/components/ui/Scramble';
import Counter from '@/components/ui/Counter';
import { profile } from '@/lib/data';
import type { ScrollState } from '@/components/three/HeroScene';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const scroll = useRef<ScrollState>({ progress: 0 });
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2400);
    return () => clearInterval(t);
  }, []);

  // Scroll drives the 3D camera (via the shared ref) and lifts the copy away.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => (scroll.current.progress = self.progress),
      });
      gsap.to(content.current, {
        y: -120,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: '80% top', scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="top" className="relative isolate grid min-h-svh content-center overflow-hidden px-5 pb-16 pt-28 md:px-8">
      <div className="absolute inset-0 -z-10">
        <HeroScene scroll={scroll} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgb(4_6_11/.85),rgb(4_6_11/.35)_50%,transparent_80%)] max-md:bg-[linear-gradient(180deg,transparent_25%,rgb(4_6_11/.75)_60%)]" />

      <div ref={content} className="mx-auto grid w-full max-w-[1120px] justify-items-start gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 font-mono text-xs text-dim"
        >
          <span className="size-1.5 rounded-full bg-mint shadow-[0_0_10px_var(--color-mint)]" />
          Available for full stack roles · {profile.location}
        </motion.div>

        <h1 className="grid font-display text-[clamp(3.6rem,13vw,10rem)] font-extrabold leading-[0.9] tracking-tight">
          <Scramble text="RAHUL" delay={200} />
          <Scramble text="PAL" delay={500} className="text-outline drop-shadow-[0_0_30px_rgb(79_227_255/.35)]" />
        </h1>

        <p className="font-mono text-[clamp(1rem,2vw,1.25rem)] text-dim">
          {profile.role} building{' '}
          <span className="relative inline-flex overflow-hidden align-bottom">
            <AnimatePresence mode="wait">
              <motion.span
                key={i}
                className="inline-block text-amber"
                initial={{ y: '100%', opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {profile.roles[i]}
              </motion.span>
            </AnimatePresence>
          </span>
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-[34em] text-lg text-soft"
        >
          I ship production software that businesses run on: an ERP and CRM suite, a D2C store, and AI features that answer from
          real business data in Hindi and English.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-3"
        >
          <a href="#work" className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-void transition hover:-translate-y-0.5 hover:bg-cyan hover:shadow-[0_10px_40px_-8px_rgb(79_227_255/.6)]">
            Explore my work <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="glass rounded-full px-6 py-3.5 text-[15px] font-semibold transition hover:border-edge-hot">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="glass rounded-full px-6 py-3.5 text-[15px] font-semibold transition hover:border-edge-hot">LinkedIn</a>
        </motion.div>
        <p className="font-mono text-[11px] text-dim/80">tip: click the glowing core · drag nothing, just move your mouse</p>
      </div>

      <dl className="glass mx-auto mt-14 grid w-full max-w-[1120px] grid-cols-2 overflow-hidden rounded-2xl md:grid-cols-4">
        {profile.stats.map((s, idx) => (
          <div key={s.label} className={`flex flex-col-reverse gap-0.5 px-5 py-4 ${idx ? 'md:border-l md:border-edge' : ''} ${idx % 2 ? 'border-l border-edge' : ''} ${idx > 1 ? 'max-md:border-t max-md:border-edge' : ''}`}>
            <dt className="font-mono text-[11px] uppercase tracking-widest text-dim">{s.label}</dt>
            <dd className="text-grad font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tabular-nums">
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>

      <a href="#work" aria-label="Scroll to projects" className="absolute bottom-5 left-1/2 h-9 w-[22px] -translate-x-1/2 rounded-xl border border-edge-hot max-md:hidden">
        <span className="absolute left-1/2 top-[7px] h-[7px] w-[3px] -translate-x-1/2 rounded-sm bg-cyan animate-scroll-dot" />
      </a>
    </section>
  );
}
