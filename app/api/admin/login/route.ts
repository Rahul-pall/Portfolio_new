import { NextResponse } from 'next/server';
import { SESSION_COOKIE, checkPassword, createSession } from '@/lib/session';

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin password is not configured on the server.' }, { status: 500 });
  }
  if (!password || !(await checkPassword(password))) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 900));
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }
  const session = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: session.maxAge,
  });
  return res;
}
