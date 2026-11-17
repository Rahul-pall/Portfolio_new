'use client';

import { createContext, useContext } from 'react';
import type { Content } from '@/lib/defaults';

const Ctx = createContext<Content | null>(null);

export function ContentProvider({ value, children }: { value: Content; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The site's editable content, loaded once per page by the (site) layout. */
export function useContent() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useContent must be used inside ContentProvider');
  return c;
}
