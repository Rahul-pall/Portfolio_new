import type { Metadata, Viewport } from 'next';
import { Unbounded, Figtree, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/ui/Cursor';
import Nav from '@/components/Nav';
import CommandPalette from '@/components/CommandPalette';
import Footer from '@/components/Footer';

const unbounded = Unbounded({ subsets: ['latin'], weight: ['400', '600', '800'], variable: '--font-unbounded' });
const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-figtree' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Rahul Pal — Full Stack Developer', template: '%s · Rahul Pal' },
  description: 'Rahul Pal, Full Stack Developer building ERP, e-commerce and AI-powered web apps with React, Next.js, Node.js and PostgreSQL.',
  openGraph: {
    title: 'Rahul Pal — Full Stack Developer',
    description: 'ERP, e-commerce and AI-powered web apps. React · Node.js · PostgreSQL · OpenAI.',
    images: ['/projects/erpdash.jpg'],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2304060B'/%3E%3Ctext x='16' y='22' font-family='monospace' font-size='15' font-weight='700' text-anchor='middle' fill='%234FE3FF'%3ERP%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: '#04060B' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${figtree.variable} ${jetbrains.variable}`}>
      <body>
        <div className="space-bg" aria-hidden="true" />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <CommandPalette />
        {children}
        <Footer />
      </body>
    </html>
  );
}
