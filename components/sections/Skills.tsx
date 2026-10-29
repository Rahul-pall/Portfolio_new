'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useInView } from 'motion/react';
import { skills } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';
import SectionHead from './SectionHead';

const SkillsPhysics = dynamic(() => import('@/components/three/SkillsPhysics'), { ssr: false });

const DOT: Record<string, string> = {
  Frontend: 'bg-cyan',
  Backend: 'bg-violet',
  'Data & AI': 'bg-amber',
  DevOps: 'bg-mint',
};

export default function Skills() {
  const box = useRef<HTMLDivElement>(null);
  // Only start the physics world once the section is close to the screen.
  const near = useInView(box, { once: true, margin: '800px' });
  const shake = useRef<(() => void) | null>(null);

  return (
    <section id="skills" className="mx-auto max-w-[1120px] px-5 pb-10 pt-28 md:px-8">
      <SectionHead
        eyebrow="Stack"
        title={<>Tools with <span className="text-grad">real weight.</span></>}
        text="Every tile is a rigid body. Move your mouse through them, click one to throw it, or shake the box."
      />
      <Reveal>
        <div ref={box} className="relative h-[460px] overflow-hidden rounded-[22px] border border-edge bg-[radial-gradient(ellipse_at_50%_100%,rgb(79_227_255/.08),transparent_60%)] md:h-[520px]">
          {near && <SkillsPhysics shake={shake} />}
          <button
            onClick={() => shake.current?.()}
            className="glass absolute right-4 top-4 rounded-full px-4 py-2 font-mono text-xs text-cyan transition hover:border-edge-hot"
          >
            ⟲ Shake the box
          </button>
          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-3 font-mono text-[11px] text-dim">
            {Object.keys(skills).map((g) => (
              <span key={g} className="flex items-center gap-1.5"><i className={`size-2 rounded-full ${DOT[g]}`} />{g}</span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="rounded-2xl glass p-5">
            <h3 className="mb-2.5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-dim">
              <i className={`size-2 rounded-full ${DOT[group]}`} /> {group}
            </h3>
            <p className="text-[15px] text-soft">{items.join(' · ')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
