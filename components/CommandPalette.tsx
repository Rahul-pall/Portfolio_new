'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { profile, projects } from '@/lib/data';

type Item = { label: string; hint: string; run: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);
  useEffect(() => setSel(0), [q]);

  const items = useMemo<Item[]>(() => {
    const go = (hash: string) => () => router.push(`/#${hash}`);
    const ext = (url: string) => () => window.open(url, '_blank', 'noopener');
    return [
      { label: 'Go to projects', hint: 'section', run: go('work') },
      { label: 'Go to AI demo', hint: 'section', run: go('ai') },
      { label: 'Go to journey', hint: 'section', run: go('experience') },
      { label: 'Go to stack', hint: 'section', run: go('skills') },
      { label: 'Go to contact', hint: 'section', run: go('contact') },
      ...projects.map((p) => ({ label: `Case study: ${p.title}`, hint: 'page', run: () => router.push(`/projects/${p.slug}/`) })),
      ...projects.filter((p) => p.live).map((p) => ({ label: `Open live: ${p.title}`, hint: 'live', run: ext(p.live!) })),
      { label: 'Open GitHub', hint: 'link', run: ext(profile.github) },
      { label: 'Open LinkedIn', hint: 'link', run: ext(profile.linkedin) },
      { label: 'Copy email', hint: 'action', run: () => navigator.clipboard?.writeText(profile.email).catch(() => {}) },
    ];
  }, [router]);

  const shown = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  const run = (item: Item) => {
    item.run();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] grid items-start justify-items-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="w-[min(580px,100%)] overflow-hidden rounded-2xl border border-edge-hot bg-panel-solid shadow-[0_40px_120px_-20px_rgb(79_227_255/.35)]"
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              id="palette-input"
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                if (e.key === 'Enter' && shown[sel]) run(shown[sel]);
              }}
              placeholder="Type a command or search…"
              autoComplete="off"
              className="w-full border-b border-edge bg-transparent px-5 py-4 font-mono outline-none placeholder:text-dim"
            />
            <ul className="max-h-[360px] overflow-auto p-2" data-lenis-prevent>
              {shown.map((item, i) => (
                <li key={item.label}>
                  <button
                    onMouseEnter={() => setSel(i)}
                    onClick={() => run(item)}
                    className={`flex w-full justify-between rounded-lg px-3.5 py-2.5 text-left ${i === sel ? 'bg-cyan/10 text-cyan' : ''}`}
                  >
                    <span>{item.label}</span>
                    <small className="font-mono text-[11px] text-dim">{item.hint}</small>
                  </button>
                </li>
              ))}
              {!shown.length && <li className="p-3.5 text-dim">No match for “{q}”</li>}
            </ul>
            <div className="flex gap-5 border-t border-edge px-5 py-2.5 font-mono text-[11px] text-dim">
              <span>↑↓ move</span><span>↵ open</span><span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
