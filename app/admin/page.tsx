'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Content } from '@/lib/defaults';
import { Area, IconBtn, ListEditor, Tags, Text } from '@/components/admin/fields';
import ProjectEditor, { newProject } from '@/components/admin/ProjectEditor';

type Tab = 'projects' | 'profile' | 'experience' | 'skills' | 'ai';
const TABS: [Tab, string][] = [
  ['projects', 'Projects'],
  ['profile', 'Profile & contact'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['ai', 'AI demo'],
];

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState<Tab>('projects');
  const [selected, setSelected] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error' | 'busy'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => (r.status === 401 ? router.replace('/admin/login') : r.json()))
      .then((c) => c && setContent(c));
  }, [router]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);

  const update = useCallback((patch: Partial<Content>) => {
    setContent((c) => (c ? { ...c, ...patch } : c));
    setDirty(true);
    setStatus(null);
  }, []);

  const save = async () => {
    if (!content) return;
    setStatus({ kind: 'busy', text: 'Saving…' });
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return router.replace('/admin/login');
    if (res.ok) {
      setDirty(false);
      setStatus({ kind: 'ok', text: 'Saved. The live site is updated.' });
    } else {
      setStatus({ kind: 'error', text: data.error ?? 'Could not save. Try again.' });
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (!content) return <p className="p-10 font-mono text-sm text-dim">Loading content…</p>;

  const { projects, profile } = content;
  const current = projects[Math.min(selected, projects.length - 1)];

  return (
    <div className="mx-auto grid max-w-[1280px] gap-6 px-4 pb-24 pt-6 md:px-6">
      <header className="glass sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-cyan" />
          <span className="font-mono text-sm">rahul.pal / admin</span>
          {dirty && <span className="rounded-full bg-amber/15 px-2 py-0.5 font-mono text-[11px] text-amber">unsaved changes</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status && (
            <span role="status" className={`text-sm ${status.kind === 'error' ? 'text-[#FF7A85]' : status.kind === 'ok' ? 'text-mint' : 'text-dim'}`}>
              {status.text}
            </span>
          )}
          <a href="/" target="_blank" rel="noopener" className="rounded-full border border-edge px-4 py-2 text-sm text-dim hover:text-ink">View site ↗</a>
          <button onClick={logout} className="rounded-full border border-edge px-4 py-2 text-sm text-dim hover:text-ink">Sign out</button>
          <button onClick={save} disabled={!dirty || status?.kind === 'busy'} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-void transition hover:bg-cyan disabled:opacity-40">
            Save changes
          </button>
        </div>
      </header>

      <nav aria-label="Admin sections" className="flex flex-wrap gap-2">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm transition ${tab === id ? 'bg-cyan text-void' : 'text-dim hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'projects' && (
        <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="glass grid gap-1.5 rounded-2xl p-3 lg:sticky lg:top-24">
            <p className="px-2 pb-1 text-xs text-dim">The first project is shown as the big featured card.</p>
            {projects.map((p, i) => (
              <div key={i} className={`flex items-center gap-1 rounded-lg ${i === selected ? 'bg-cyan/10' : ''}`}>
                <button onClick={() => setSelected(i)} className={`min-w-0 flex-1 truncate px-3 py-2 text-left text-sm ${i === selected ? 'text-cyan' : 'text-soft'}`}>
                  {p.title || 'Untitled'}
                </button>
                <IconBtn
                  label="Move up"
                  onClick={() => {
                    if (i === 0) return;
                    const next = [...projects];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    update({ projects: next });
                    setSelected(i - 1);
                  }}
                >↑</IconBtn>
                <IconBtn
                  label="Move down"
                  onClick={() => {
                    if (i === projects.length - 1) return;
                    const next = [...projects];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    update({ projects: next });
                    setSelected(i + 1);
                  }}
                >↓</IconBtn>
              </div>
            ))}
            <button
              onClick={() => {
                update({ projects: [...projects, newProject(projects.length + 1)] });
                setSelected(projects.length);
              }}
              className="mt-1 rounded-lg border border-dashed border-edge-hot px-3 py-2 font-mono text-xs text-cyan hover:bg-cyan/10"
            >
              + Add project
            </button>
          </aside>

          {current ? (
            <section className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-display text-2xl font-bold">{current.title || 'Untitled'}</h1>
                <DeleteButton
                  label={current.title}
                  onConfirm={() => {
                    update({ projects: projects.filter((_, k) => k !== selected) });
                    setSelected(Math.max(0, selected - 1));
                  }}
                />
              </div>
              <ProjectEditor
                key={selected}
                project={current}
                onChange={(p) => update({ projects: projects.map((x, k) => (k === selected ? p : x)) })}
              />
            </section>
          ) : (
            <p className="text-dim">No projects yet. Add one from the list.</p>
          )}
        </div>
      )}

      {tab === 'profile' && (
        <section className="glass grid max-w-3xl gap-4 rounded-2xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Name" value={profile.name} onChange={(name) => update({ profile: { ...profile, name } })} />
            <Text label="Role" value={profile.role} onChange={(role) => update({ profile: { ...profile, role } })} />
            <Text label="Location" value={profile.location} onChange={(location) => update({ profile: { ...profile, location } })} />
            <Text label="Email" type="email" value={profile.email} onChange={(email) => update({ profile: { ...profile, email } })} />
            <Text label="Phone" value={profile.phone} onChange={(phone) => update({ profile: { ...profile, phone } })} />
            <Text label="GitHub URL" type="url" value={profile.github} onChange={(github) => update({ profile: { ...profile, github } })} />
            <Text label="LinkedIn URL" type="url" value={profile.linkedin} onChange={(linkedin) => update({ profile: { ...profile, linkedin } })} />
          </div>
          <Tags label="Rotating words in the hero" value={profile.roles} onChange={(roles) => update({ profile: { ...profile, roles } })} />
          <ListEditor
            label="Stats bar"
            items={profile.stats}
            onChange={(stats) => update({ profile: { ...profile, stats } })}
            make={() => ({ value: 0, suffix: '', label: '', decimals: 0 })}
            addLabel="Add stat"
            render={(s, set) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <Text label="Number" type="number" value={String(s.value)} onChange={(v) => set({ value: Number(v) || 0, decimals: v.includes('.') ? 1 : 0 })} />
                <Text label="Suffix" value={s.suffix} onChange={(suffix) => set({ suffix })} placeholder="+" />
                <Text label="Label" value={s.label} onChange={(label) => set({ label })} />
              </div>
            )}
          />
        </section>
      )}

      {tab === 'experience' && (
        <section className="glass max-w-3xl rounded-2xl p-6">
          <ListEditor
            label="Timeline (newest first)"
            items={content.experience}
            onChange={(experience) => update({ experience })}
            make={() => ({ when: '', role: '', org: '', text: '' })}
            addLabel="Add entry"
            render={(e, set) => (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Text label="When" value={e.when} onChange={(when) => set({ when })} placeholder="Feb 2025 — Now" />
                  <Text label="Role" value={e.role} onChange={(role) => set({ role })} />
                  <Text label="Organisation" value={e.org} onChange={(org) => set({ org })} />
                </div>
                <Area label="Description" rows={2} value={e.text} onChange={(text) => set({ text })} />
              </>
            )}
          />
        </section>
      )}

      {tab === 'skills' && (
        <section className="glass grid max-w-3xl gap-5 rounded-2xl p-6">
          <ListEditor
            label="Skill groups (each becomes a colour in the physics box)"
            items={Object.entries(content.skills).map(([group, items]) => ({ group, items }))}
            onChange={(rows) => update({ skills: Object.fromEntries(rows.map((r) => [r.group, r.items])) })}
            make={() => ({ group: `Group ${Object.keys(content.skills).length + 1}`, items: [] as string[] })}
            addLabel="Add group"
            render={(r, set) => (
              <>
                <Text label="Group name" value={r.group} onChange={(group) => set({ group })} />
                <Tags label="Skills" value={r.items} onChange={(items) => set({ items })} />
              </>
            )}
          />
          <Tags label="Scrolling tech strip" value={content.marquee} onChange={(marquee) => update({ marquee })} />
        </section>
      )}

      {tab === 'ai' && (
        <section className="glass grid max-w-3xl gap-6 rounded-2xl p-6">
          <ListEditor
            label="Assistant demo questions"
            items={content.conversations}
            onChange={(conversations) => update({ conversations })}
            make={() => ({ q: '', a: '', reads: [] as string[] })}
            addLabel="Add question"
            render={(c, set) => (
              <>
                <Text label="Question" value={c.q} onChange={(q) => set({ q })} />
                <Area label="Answer" rows={2} value={c.a} onChange={(a) => set({ a })} />
                <Tags label="Data lookups shown under the answer" value={c.reads} onChange={(reads) => set({ reads })} />
              </>
            )}
          />
          <ListEditor
            label="AI cards"
            items={content.aiCards}
            onChange={(aiCards) => update({ aiCards })}
            make={() => ({ tag: '', title: '', text: '' })}
            addLabel="Add card"
            render={(c, set) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Text label="Tag" value={c.tag} onChange={(tag) => set({ tag })} />
                  <Text label="Title" value={c.title} onChange={(title) => set({ title })} />
                </div>
                <Area label="Text" rows={2} value={c.text} onChange={(text) => set({ text })} />
              </>
            )}
          />
        </section>
      )}
    </div>
  );
}

function DeleteButton({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button onClick={() => setAsking(true)} className="rounded-full border border-edge px-4 py-2 text-sm text-dim hover:border-[#FF7A85] hover:text-[#FF7A85]">
        Delete project
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-soft">Delete “{label}”? It goes when you save.</span>
      <button onClick={() => { onConfirm(); setAsking(false); }} className="rounded-full bg-[#FF7A85] px-3 py-1.5 font-semibold text-void">Delete</button>
      <button onClick={() => setAsking(false)} className="rounded-full border border-edge px-3 py-1.5 text-dim">Cancel</button>
    </div>
  );
}
