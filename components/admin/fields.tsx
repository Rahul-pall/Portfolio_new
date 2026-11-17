'use client';

import { useId, useState } from 'react';

// Small form building blocks for the admin panel.

const input = 'w-full rounded-lg border border-edge bg-void/60 px-3 py-2 text-[15px] outline-none transition focus:border-cyan';

export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-widest text-dim">{label}</label>
      {children(id)}
      {hint && <p className="text-xs text-dim/80">{hint}</p>}
    </div>
  );
}

export function Text({ label, value, onChange, hint, placeholder, type = 'text' }: { label: string; value: string | undefined; onChange: (v: string) => void; hint?: string; placeholder?: string; type?: string }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => <input id={id} type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={input} />}
    </Field>
  );
}

export function Area({ label, value, onChange, hint, rows = 3, mono }: { label: string; value: string | undefined; onChange: (v: string) => void; hint?: string; rows?: number; mono?: boolean }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => <textarea id={id} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${input} resize-y ${mono ? 'font-mono text-[13px]' : ''}`} />}
    </Field>
  );
}

/** A list of words edited as one comma-separated line. */
export function Tags({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  const [draft, setDraft] = useState(value.join(', '));
  return (
    <Field label={label} hint={hint ?? 'Separate with commas.'}>
      {(id) => (
        <input
          id={id}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean));
          }}
          className={input}
        />
      )}
    </Field>
  );
}

export function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      {(id) => (
        <div className="flex items-center gap-2">
          <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-edge bg-transparent" />
          <input value={value} onChange={(e) => onChange(e.target.value)} className={`${input} font-mono`} aria-label={`${label} hex`} />
        </div>
      )}
    </Field>
  );
}

/** Image chosen by URL or uploaded from the computer. */
export function ImageInput({ label, value, onChange }: { label: string; value: string | undefined; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file: File) => {
    setBusy(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) onChange(data.url);
    else setError(data.error ?? 'Upload failed.');
  };

  return (
    <Field label={label}>
      {(id) => (
        <div className="grid gap-2">
          <div className="flex gap-2">
            <input id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload" className={input} />
            <label className="shrink-0 cursor-pointer rounded-lg border border-edge-hot bg-cyan/10 px-3 py-2 font-mono text-xs text-cyan">
              {busy ? 'Uploading…' : 'Upload'}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
          </div>
          {error && <p className="text-xs text-[#FF7A85]">{error}</p>}
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-40 w-auto rounded-lg border border-edge object-contain" />
          )}
        </div>
      )}
    </Field>
  );
}

/** Edits an array of objects as stacked cards with move / remove buttons. */
export function ListEditor<T>({
  label,
  items,
  onChange,
  make,
  render,
  addLabel = 'Add',
}: {
  label: string;
  items: T[];
  onChange: (v: T[]) => void;
  make: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
}) {
  const move = (i: number, d: number) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="grid gap-2.5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-dim">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="relative grid gap-3 rounded-xl border border-edge bg-void/40 p-4 pr-24">
          {render(item, (patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x))), i)}
          <div className="absolute right-3 top-3 flex gap-1">
            <IconBtn label="Move up" onClick={() => move(i, -1)}>↑</IconBtn>
            <IconBtn label="Move down" onClick={() => move(i, 1)}>↓</IconBtn>
            <IconBtn label="Remove" danger onClick={() => onChange(items.filter((_, k) => k !== i))}>✕</IconBtn>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, make()])} className="justify-self-start rounded-lg border border-dashed border-edge-hot px-3 py-1.5 font-mono text-xs text-cyan hover:bg-cyan/10">
        + {addLabel}
      </button>
    </div>
  );
}

export function IconBtn({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`grid size-7 place-items-center rounded-md border border-edge text-xs text-dim transition hover:text-ink ${danger ? 'hover:border-[#FF7A85] hover:text-[#FF7A85]' : 'hover:border-edge-hot'}`}
    >
      {children}
    </button>
  );
}
