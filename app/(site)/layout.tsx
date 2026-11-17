import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/ui/Cursor';
import Nav from '@/components/Nav';
import CommandPalette from '@/components/CommandPalette';
import Footer from '@/components/Footer';
import { ContentProvider } from '@/components/ContentProvider';
import { getContent } from '@/lib/content';

// Pages are cached and rebuilt when the admin panel saves (see lib/content.ts).
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <ContentProvider value={content}>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <CommandPalette />
      {children}
      <Footer />
    </ContentProvider>
  );
}
