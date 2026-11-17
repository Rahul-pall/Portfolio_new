'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.replace('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not sign in.');
    }
  };

  return (
    <main className="grid min-h-svh place-items-center px-5">
      <form onSubmit={submit} className="glass w-[min(400px,100%)] rounded-2xl p-8">
        <span className="font-mono text-xs text-cyan">rahul.pal / admin</span>
        <h1 className="mb-1 mt-3 font-display text-2xl font-bold">Sign in</h1>
        <p className="mb-6 text-sm text-dim">Manage the projects and content on your portfolio.</p>
        <label htmlFor="password" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-dim">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-edge bg-void/60 px-3.5 py-2.5 outline-none focus:border-cyan"
        />
        {error && <p className="mt-3 text-sm text-[#FF7A85]" role="alert">{error}</p>}
        <button disabled={busy || !password} className="mt-6 w-full rounded-full bg-ink py-3 font-semibold text-void transition hover:bg-cyan disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <a href="/" className="mt-5 block text-center font-mono text-xs text-dim hover:text-cyan">← Back to site</a>
      </form>
    </main>
  );
}
