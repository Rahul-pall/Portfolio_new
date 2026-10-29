'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience } from '@/lib/data';
import SectionHead from './SectionHead';

export default function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  // The glowing line fills as the timeline scrolls past; each entry slides in from the left.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(line.current, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: list.current, start: 'top 70%', end: 'bottom 60%', scrub: true },
      });
      gsap.utils.toArray<HTMLElement>('[data-entry]').forEach((el) => {
        gsap.from(el, { x: -40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="mx-auto max-w-[1120px] px-5 pb-10 pt-28 md:px-8">
      <SectionHead eyebrow="Journey" title={<>Where I’ve <span className="text-grad">built.</span></>} />
      <ol ref={list} className="relative grid gap-8 pl-9">
        <span className="absolute bottom-1.5 left-[7px] top-1.5 w-0.5 rounded bg-edge" aria-hidden="true" />
        <span ref={line} className="absolute bottom-1.5 left-[7px] top-1.5 w-0.5 origin-top rounded bg-grad shadow-[0_0_14px_var(--color-cyan)]" aria-hidden="true" />
        {experience.map((e) => (
          <li key={e.org} data-entry className="relative rounded-2xl glass p-6">
            <span className="absolute -left-9 top-7 z-10 size-4 rounded-full border-2 border-cyan bg-void shadow-[0_0_12px_var(--color-cyan)]" aria-hidden="true" />
            <span className="font-mono text-xs tabular-nums text-amber">{e.when}</span>
            <h3 className="my-1.5 font-display text-lg font-semibold">
              {e.role} <span className="font-sans text-[15px] font-normal text-dim">@ {e.org}</span>
            </h3>
            <p className="text-soft">{e.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
