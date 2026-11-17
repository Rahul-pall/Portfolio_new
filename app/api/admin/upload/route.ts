import { NextResponse } from 'next/server';
import { saveImage } from '@/lib/content';

const MAX = 4 * 1024 * 1024; // Vercel functions accept bodies up to ~4.5 MB

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only images can be uploaded.' }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: 'Image is larger than 4 MB. Save it as JPG or WebP and try again.' }, { status: 400 });
  return NextResponse.json({ url: await saveImage(file) });
}
