'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'motion/react';

// Counts up from zero the first time it scrolls into view.
export default function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => (el.textContent = v.toFixed(decimals) + suffix),
    });
    return () => controls.stop();
  }, [inView, value, decimals, suffix]);

  return <span ref={ref}>{value.toFixed(decimals) + suffix}</span>;
}
