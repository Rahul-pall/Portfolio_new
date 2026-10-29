'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEFXYZ';

// Text that resolves out of random glyphs, left to right.
export default function Scramble({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [out, setOut] = useState(text);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tick = 0;
    const total = text.length * 3 + 10;
    const run = () => {
      tick++;
      const done = Math.floor((tick / total) * text.length);
      setOut(text.split('').map((ch, i) => (i < done || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''));
      if (tick < total) timer.current = setTimeout(run, 32);
      else setOut(text);
    };
    timer.current = setTimeout(run, delay);
    return () => clearTimeout(timer.current);
  }, [text, delay]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
