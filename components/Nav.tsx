'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const LINKS = [
  ['/#work', 'Work'],
  ['/#ai', 'AI'],
  ['/#experience', 'Journey'],
  ['/#skills', 'Stack'],
  ['/#contact', 'Contact'],
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <header
      className={`fixed left-1/2 top-3.5 z-50 flex w-[min(1120px,calc(100%-28px))] -translate-x-1/2 items-center justify-between gap-5 overflow-hidden rounded-full border py-2.5 pl-5 pr-3 transition-colors duration-300 ${
        scrolled ? 'border-edge bg-deep/70 backdrop-blur-xl' : 'border-transparent'
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 font-mono text-[15px] font-medium">
        <span className="size-2 rounded-full bg-cyan animate-pulse-ring" />
        rahul<span className="text-cyan">.</span>pal
      </Link>
      <nav aria-label="Sections" className="hidden md:block">
        <ul className="flex gap-7">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-sm text-dim transition-colors hover:text-ink">{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={() => window.dispatchEvent(new Event('open-palette'))}
        className="flex items-center gap-1 rounded-full p-1"
        aria-label="Open command palette"
      >
        {['Ctrl', 'K'].map((k) => (
          <kbd key={k} className="rounded-md border border-edge bg-white/[.03] px-2 py-1 font-mono text-[11px] text-dim">{k}</kbd>
        ))}
      </button>
      <span
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-grad"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
    </header>
  );
}
