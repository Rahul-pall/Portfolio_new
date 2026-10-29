'use client';

import { useEffect, useRef } from 'react';

// A trailing ring that grows over links and buttons. Fine pointers only.
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const hot = (e.target as HTMLElement).closest('a, button, [data-hot], canvas');
      ring.current?.classList.toggle('scale-[1.7]', !!hot);
      ring.current?.classList.toggle('bg-cyan/10', !!hot);
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.translate = `${rx}px ${ry}px`;
      if (dot.current) dot.current.style.translate = `${x}px ${y}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    loop();
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden [.has-cursor_&]:block" aria-hidden="true">
      <div ref={ring} className="absolute -left-[18px] -top-[18px] size-9 rounded-full border border-edge-hot transition-[scale,background-color] duration-300" />
      <div ref={dot} className="absolute -left-0.5 -top-0.5 size-1 rounded-full bg-cyan" />
    </div>
  );
}
