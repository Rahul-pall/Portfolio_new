'use client';

import { useEffect, useRef, useState } from 'react';
import { conversations, aiCards } from '@/lib/data';
import { SpotlightCard } from '@/components/ui/Effects';
import Reveal from '@/components/ui/Reveal';
import SectionHead from './SectionHead';

// A replay of the ERP assistant dock: pick a question and watch the answer
// type out, followed by the lookups it was built from.
export default function AIConsole() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState('');
  const [showReads, setShowReads] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const convo = conversations[active];

  useEffect(() => {
    setShowReads(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(convo.a);
      setShowReads(true);
      return;
    }
    let n = 0;
    setTyped('');
    const step = () => {
      n += 2;
      setTyped(convo.a.slice(0, n));
      if (n < convo.a.length) timer.current = setTimeout(step, 22);
      else timer.current = setTimeout(() => setShowReads(true), 220);
    };
    timer.current = setTimeout(step, 450);
    return () => clearTimeout(timer.current);
  }, [convo]);

  const done = typed.length >= convo.a.length;

  return (
    <section id="ai" className="mx-auto max-w-[1120px] px-5 pb-10 pt-28 md:px-8">
      <SectionHead
        eyebrow="AI in production"
        title={<>Ask the ERP <span className="text-grad">anything.</span></>}
        text="The assistant I built into the Amasia ERP answers staff in Hindi or English. Pick a question to see how it replies."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="min-w-0">
          <div className="overflow-hidden rounded-[18px] border border-edge bg-[#060a12]/90 font-mono shadow-[0_30px_80px_-40px_rgb(79_227_255/.45)]">
            <div className="flex flex-wrap items-center gap-3.5 border-b border-edge px-4 py-3 text-xs text-dim">
              <span className="flex gap-1.5">
                <i className="size-2.5 rounded-full bg-[#FF5F6D]" />
                <i className="size-2.5 rounded-full bg-amber" />
                <i className="size-2.5 rounded-full bg-mint" />
              </span>
              <span>erp://assistant-dock</span>
              <span className="ml-auto rounded-full border border-edge-hot px-2 py-0.5 text-[10px] text-cyan">gpt-4o-mini · read-only</span>
            </div>
            <div className="grid min-h-[250px] content-start gap-4 px-5 py-6 text-[14.5px] leading-relaxed" aria-live="polite">
              <div className="grid gap-1 text-amber">
                <span className="text-[10px] uppercase tracking-[.12em] text-dim">staff</span>
                {convo.q}
              </div>
              <div className="grid gap-1">
                <span className="text-[10px] uppercase tracking-[.12em] text-dim">assistant</span>
                <span>
                  {typed}
                  {!done && <span className="ml-0.5 inline-block h-[1.1em] w-[.55em] animate-blink bg-cyan align-[-3px]" />}
                </span>
              </div>
              <div className={`grid gap-0.5 border-l-2 border-violet pl-3 text-xs text-dim transition-all duration-300 ${showReads ? 'opacity-100' : 'translate-y-1.5 opacity-0'}`}>
                {convo.reads.map((r) => (
                  <div key={r}><span className="text-violet">read</span> {r}</div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 px-5 pb-4">
              {conversations.map((c, idx) => (
                <button
                  key={c.q}
                  onClick={() => setActive(idx)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${idx === active ? 'border-cyan bg-cyan text-void' : 'border-edge text-dim hover:border-edge-hot hover:text-ink'}`}
                >
                  {c.q}
                </button>
              ))}
            </div>
            <div className="border-t border-edge px-5 py-2.5 text-[11px] text-dim">Demo replay · figures are illustrative</div>
          </div>
        </Reveal>

        <div className="grid gap-3.5">
          {aiCards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <SpotlightCard className="p-6">
                <span className="font-mono text-xs text-amber">{c.tag}</span>
                <h3 className="mb-1.5 mt-2 font-display text-[17px] font-semibold">{c.title}</h3>
                <p className="text-[15px] text-dim">{c.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
