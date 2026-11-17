'use client';

import type { Category, Project } from '@/lib/defaults';
import { Area, Color, ImageInput, ListEditor, Tags, Text } from './fields';

const CATEGORIES: Category[] = ['AI', 'Enterprise', 'E-commerce', 'Open source'];

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

export function newProject(n: number): Project {
  return {
    slug: `new-project-${n}`,
    title: 'New project',
    tagline: '',
    kind: '',
    categories: [],
    year: String(new Date().getFullYear()),
    role: '',
    accent: '#4FE3FF',
    gallery: [],
    summary: '',
    problem: '',
    built: [],
    stack: [],
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-2xl border border-edge p-5">
      <legend className="px-2 font-display text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function ProjectEditor({ project, onChange }: { project: Project; onChange: (p: Project) => void }) {
  const set = (patch: Partial<Project>) => onChange({ ...project, ...patch });

  return (
    <div className="grid gap-5">
      <Section title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Text label="Title" value={project.title} onChange={(title) => set({ title })} />
          <Text
            label="URL slug"
            value={project.slug}
            onChange={(v) => set({ slug: slugify(v) })}
            hint={`Page address: /projects/${project.slug || '…'}`}
          />
          <Text label="Tagline" value={project.tagline} onChange={(tagline) => set({ tagline })} placeholder="Every grain accounted for." />
          <Text label="Kind" value={project.kind} onChange={(kind) => set({ kind })} placeholder="Enterprise · ERP / CRM · AI" />
          <Text label="Year" value={project.year} onChange={(year) => set({ year })} placeholder="2025 — now" />
          <Color label="Accent colour" value={project.accent || '#4FE3FF'} onChange={(accent) => set({ accent })} />
        </div>
        <div className="grid gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-dim">Filters</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = project.categories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set({ categories: on ? project.categories.filter((x) => x !== c) : [...project.categories, c] })}
                  className={`rounded-full border px-3 py-1 text-sm transition ${on ? 'border-cyan bg-cyan text-void' : 'border-edge text-dim hover:text-ink'}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title="Links">
        <div className="grid gap-4 md:grid-cols-2">
          <Text label="Live site URL" type="url" value={project.live} onChange={(v) => set({ live: v || undefined })} placeholder="https://…" hint="Shows the LIVE badge and Visit live button." />
          <Text label="Source code URL" type="url" value={project.repo} onChange={(v) => set({ repo: v || undefined })} placeholder="https://github.com/…" />
        </div>
      </Section>

      <Section title="Images">
        <ImageInput label="Cover screenshot (desktop, 16:10)" value={project.cover} onChange={(v) => set({ cover: v || undefined })} />
        <ListEditor
          label="Gallery"
          items={project.gallery}
          onChange={(gallery) => set({ gallery })}
          make={(): Project['gallery'][number] => ({ src: '', alt: '' })}
          addLabel="Add screen"
          render={(g, update) => (
            <>
              <ImageInput label="Image" value={g.src} onChange={(src) => update({ src })} />
              <Text label="Description (alt text)" value={g.alt} onChange={(alt) => update({ alt })} />
              <label className="flex items-center gap-2 text-sm text-soft">
                <input type="checkbox" checked={!!g.mobile} onChange={(e) => update({ mobile: e.target.checked || undefined })} />
                Phone screenshot (shown in a phone frame)
              </label>
            </>
          )}
        />
        {!project.cover && (
          <Area label="Code snippet (shown instead of a screenshot)" mono rows={5} value={project.code} onChange={(v) => set({ code: v || undefined })} />
        )}
      </Section>

      <Section title="Story">
        <Area label="Summary" value={project.summary} onChange={(summary) => set({ summary })} />
        <Area label="The challenge" value={project.problem} onChange={(problem) => set({ problem })} />
        <Text label="My role" value={project.role} onChange={(role) => set({ role })} />
        <Tags label="Tech stack" value={project.stack} onChange={(stack) => set({ stack })} />
      </Section>

      <Section title="Case study">
        <ListEditor
          label="What I built"
          items={project.built}
          onChange={(built) => set({ built })}
          make={() => ({ title: '', text: '' })}
          addLabel="Add feature"
          render={(b, update) => (
            <>
              <Text label="Title" value={b.title} onChange={(title) => update({ title })} />
              <Area label="Description" rows={2} value={b.text} onChange={(text) => update({ text })} />
            </>
          )}
        />
        <ListEditor
          label="Key numbers"
          items={project.metrics ?? []}
          onChange={(metrics) => set({ metrics: metrics.length ? metrics : undefined })}
          make={() => ({ value: '', label: '' })}
          addLabel="Add number"
          render={(m, update) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Text label="Value" value={m.value} onChange={(value) => update({ value })} placeholder="54" />
              <Text label="Label" value={m.label} onChange={(label) => update({ label })} placeholder="API route modules" />
            </div>
          )}
        />
      </Section>
    </div>
  );
}
