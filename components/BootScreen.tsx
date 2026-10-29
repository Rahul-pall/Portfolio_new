'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const LINES = [
  '> booting rahul.pal v2026.10',
  '> loading modules: erp · crm · procurement · o2d',
  '> connecting openai ............ ok',
  '> connecting whatsapp api ...... ok',
  '> postgres handshake ........... ok',
  '> rendering interface',
];

// Plays once per browser session; click anywhere to skip.
export default function BootScreen() {
  const [show, setShow] = useState(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('booted')) return;
      sessionStorage.setItem('booted', '1');
    } catch {}
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    if (shown < LINES.length) {
      const t = setTimeout(() => setShown((n) => n + 1), 190);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShow(false), 350);
    return () => clearTimeout(t);
  }, [show, shown]);

  const pct = Math.round((shown / LINES.length) * 100);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-void p-6"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6 }}
          onClick={() => setShow(false)}
          role="status"
        >
          <div className="w-[min(520px,100%)] font-mono text-sm leading-[1.9] text-dim">
            {LINES.slice(0, shown).map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={i === shown - 1 ? 'text-cyan' : ''}>
                {l}
              </motion.div>
            ))}
            <div className="mt-4 h-0.5 overflow-hidden bg-edge">
              <span className="block h-full bg-grad shadow-[0_0_12px_var(--color-cyan)] transition-[width] duration-200" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px]"><span>{pct}%</span><span>click to skip</span></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
