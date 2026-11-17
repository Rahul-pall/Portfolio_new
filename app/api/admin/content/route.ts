import { NextResponse } from 'next/server';
import { readContent, saveContent } from '@/lib/content';
import type { Content } from '@/lib/defaults';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await readContent());
}

export async function PUT(req: Request) {
  const content = (await req.json().catch(() => null)) as Content | null;
  if (!content || !Array.isArray(content.projects) || !content.profile) {
    return NextResponse.json({ error: 'The content is incomplete, nothing was saved.' }, { status: 400 });
  }
  const slugs = content.projects.map((p) => p.slug);
  const bad = content.projects.find((p) => !p.title?.trim() || !/^[a-z0-9-]+$/.test(p.slug));
  if (bad) {
    return NextResponse.json({ error: `Project "${bad.title || 'untitled'}" needs a title and a URL slug of lowercase letters, numbers and dashes.` }, { status: 400 });
  }
  if (new Set(slugs).size !== slugs.length) {
    return NextResponse.json({ error: 'Two projects share the same URL slug.' }, { status: 400 });
  }
  await saveContent(content);
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
