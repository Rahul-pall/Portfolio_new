import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { unstable_cache, revalidatePath, revalidateTag } from 'next/cache';
import { defaultContent, type Content } from './defaults';

// Where the site's content lives:
// - On Vercel (BLOB_READ_WRITE_TOKEN set): a JSON file in Vercel Blob, one new file per save.
// - Locally without a token: .data/content.json, so the admin panel works in `npm run dev`.
// Until the first save, the defaults in lib/defaults.ts are shown.

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const LOCAL_FILE = path.join(process.cwd(), '.data', 'content.json');
const PREFIX = 'content/';

async function readRaw(): Promise<Content | null> {
  if (useBlob()) {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: PREFIX });
    if (!blobs.length) return null;
    const latest = blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0];
    const res = await fetch(latest.url, { cache: 'no-store' });
    return res.ok ? ((await res.json()) as Content) : null;
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8')) as Content;
  } catch {
    return null;
  }
}

/** Saved content merged over the defaults, so a field added later never comes back empty. */
export async function readContent(): Promise<Content> {
  const saved = await readRaw();
  return saved ? { ...defaultContent, ...saved, profile: { ...defaultContent.profile, ...saved.profile } } : defaultContent;
}

/** Cached for page renders; cleared on every save. */
export const getContent = unstable_cache(readContent, ['site-content'], { tags: ['content'] });

export async function saveContent(content: Content) {
  const body = JSON.stringify(content, null, 2);
  if (useBlob()) {
    const { put, list, del } = await import('@vercel/blob');
    const { blobs: old } = await list({ prefix: PREFIX });
    await put(`${PREFIX}content-${Date.now()}.json`, body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: true,
      cacheControlMaxAge: 60,
    });
    // Keep the last few saves as a safety net; drop the rest.
    const stale = old.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).slice(4);
    if (stale.length) await del(stale.map((b) => b.url));
  } else {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, body);
  }
  revalidateTag('content');
  revalidatePath('/', 'layout');
}

/** Stores an uploaded image and returns the URL to use in the site. */
export async function saveImage(file: File): Promise<string> {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-60);
  if (useBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${safe}`, file, { access: 'public', addRandomSuffix: true, contentType: file.type });
    return blob.url;
  }
  const name = `${Date.now()}-${safe}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
