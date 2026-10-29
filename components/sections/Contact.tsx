'use client';

import { useState } from 'react';
import { profile } from '@/lib/data';
import { BorderBeam, Meteors } from '@/components/ui/Effects';
import Reveal from '@/components/ui/Reveal';

function CopyRow({ label, value }: { label: string; value: string }) {
  const [state, setState] = useState('Copy');
  return (
    <div className="flex items-center justify-between gap-3.5 rounded-xl glass px-5 py-4 transition-colors hover:border-edge-hot">
      <div className="min-w-0">
        <span className="block font-mono text-[11px] uppercase tracking-widest text-dim">{label}</span>
        <span className="select-all break-all font-medium">{value}</span>
      </div>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setState('Copied');
          } catch {
            setState('Select it');
          }
          setTimeout(() => setState('Copy'), 1600);
        }}
        className="shrink-0 rounded-lg border border-edge-hot bg-cyan/10 px-3 py-1.5 font-mono text-xs text-cyan"
      >
        {state}
      </button>
    </div>
  );
}

function LinkRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3.5 rounded-xl glass px-5 py-4 transition hover:translate-x-1 hover:border-edge-hot">
      <div className="min-w-0">
        <span className="block font-mono text-[11px] uppercase tracking-widest text-dim">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <span aria-hidden="true" className="text-cyan">↗</span>
    </a>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1120px] px-5 pb-24 pt-28 md:px-8">
      <div className="relative overflow-hidden rounded-[28px] border border-edge bg-[radial-gradient(ellipse_at_top_left,rgb(139_124_255/.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(79_227_255/.12),transparent_55%)] p-7 md:p-12">
        <Meteors number={16} />
        <BorderBeam size={260} duration={10} color="var(--color-violet)" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="grid justify-items-start gap-5">
            <span className="font-mono text-sm text-cyan">{'// Contact'}</span>
            <h2 className="font-display text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-none tracking-tight">
              Let’s build<br /><span className="text-grad">what’s next.</span>
            </h2>
            <p className="text-dim">Open to full stack roles and freelance work. Email is the fastest way to reach me.</p>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 font-semibold text-void transition hover:-translate-y-0.5 hover:bg-cyan">
              Say hello <span aria-hidden="true">→</span>
            </a>
          </Reveal>
          <Reveal delay={0.15} className="grid gap-2.5">
            <CopyRow label="Email" value={profile.email} />
            <CopyRow label="Phone" value={profile.phone} />
            <LinkRow label="LinkedIn" value="rahul-pal-71498a244" href={profile.linkedin} />
            <LinkRow label="GitHub" value="Rahul-pall" href={profile.github} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
