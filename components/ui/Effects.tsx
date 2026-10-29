'use client';

import { useRef } from 'react';

// Aceternity / Magic UI–style pieces, written for this site.

/** A small bright segment that travels around its parent's border. Parent needs `relative` and a radius. */
export function BorderBeam({ size = 180, duration = 7, color = 'var(--color-cyan)', delay = 0 }: { size?: number; duration?: number; color?: string; delay?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] border border-transparent"
    >
      <div
        className="absolute aspect-square animate-beam"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${color}, transparent)`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
        }}
      />
    </div>
  );
}

/** Card whose surface lights up under the pointer. */
export function SpotlightCard({ children, className = '', color = 'rgb(79 227 255 / .14)' }: { children: React.ReactNode; className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
        ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      className={`group relative overflow-hidden rounded-2xl glass transition-colors hover:border-edge-hot ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx) var(--my), ${color}, transparent 45%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/** Falling streaks of light, placed deterministically so server and client agree. */
export function Meteors({ number = 14 }: { number?: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: number }, (_, i) => (
        <span
          key={i}
          className="absolute size-0.5 rotate-[215deg] animate-meteor rounded-full bg-cyan shadow-[0_0_0_1px_#ffffff10] before:absolute before:top-1/2 before:h-px before:w-[70px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-cyan before:to-transparent"
          style={{
            top: `${(i * 37) % 40 - 10}%`,
            left: `${(i * 61) % 100}%`,
            animationDelay: `${(i * 0.73) % 5}s`,
            animationDuration: `${4 + ((i * 1.3) % 6)}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Mac-style window frame for a screenshot. */
export function BrowserFrame({ url, children, className = '' }: { url?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-edge bg-panel-solid shadow-[0_30px_80px_-40px_rgb(79_227_255/.5)] ${className}`}>
      <div className="flex items-center gap-3 border-b border-edge px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-[#FF5F6D]" />
          <i className="size-2.5 rounded-full bg-amber" />
          <i className="size-2.5 rounded-full bg-mint" />
        </span>
        {url && (
          <span className="min-w-0 flex-1 truncate rounded-md bg-white/[.04] px-3 py-1 text-center font-mono text-[11px] text-dim">
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/** Phone frame for a mobile screenshot. */
export function PhoneFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border-[6px] border-[#1a2238] bg-panel-solid shadow-[0_30px_80px_-30px_rgb(139_124_255/.6)] ${className}`}>
      <span className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-[#1a2238]" />
      {children}
    </div>
  );
}
