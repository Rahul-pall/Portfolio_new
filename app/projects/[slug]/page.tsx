import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/data';
import { BorderBeam, BrowserFrame, PhoneFrame, SpotlightCard } from '@/components/ui/Effects';
import Reveal from '@/components/ui/Reveal';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.summary, openGraph: { images: p.cover ? [p.cover] : [] } };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const desktop = p.gallery.filter((g) => !g.mobile);
  const mobile = p.gallery.filter((g) => g.mobile);

  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-32 md:px-8">
      <Link href="/#work" className="mb-10 inline-flex items-center gap-2 font-mono text-sm text-dim transition hover:text-cyan">
        ← All projects
      </Link>

      <Reveal className="grid gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-amber">{p.kind}</span>
          {p.live && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint">
              <span className="size-1.5 animate-pulse rounded-full bg-mint" /> LIVE
            </span>
          )}
        </div>
        <h1 className="font-display text-[clamp(2.6rem,8vw,5.6rem)] font-extrabold leading-[0.95] tracking-tight">{p.title}</h1>
        <p className="text-grad font-display text-[clamp(1.1rem,2.4vw,1.6rem)] font-semibold">{p.tagline}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {p.live && (
            <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-void transition hover:bg-cyan">
              Visit live site <span aria-hidden="true">↗</span>
            </a>
          )}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-void transition hover:bg-cyan">
              View source <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="relative mt-14">
        {p.cover ? (
          <div className="relative">
            <BrowserFrame url={p.live}>
              <div className="relative aspect-[16/10]">
                <Image src={p.cover} alt={`${p.title} home screen`} fill priority sizes="(max-width: 1120px) 100vw, 1120px" className="object-cover object-top" />
              </div>
            </BrowserFrame>
            {mobile[0] && (
              <PhoneFrame className="absolute -bottom-10 right-6 w-[22%] max-md:hidden">
                <div className="relative aspect-[390/844]">
                  <Image src={mobile[0].src} alt={mobile[0].alt} fill sizes="260px" className="object-cover object-top" />
                </div>
              </PhoneFrame>
            )}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-edge bg-void/80 font-mono">
            <BorderBeam size={240} duration={8} color={p.accent} />
            <div className="border-b border-edge px-5 py-3 text-xs text-dim">{p.repo ? p.repo.replace('https://github.com/', '') : 'demo/Authentication'}</div>
            <pre className="overflow-x-auto p-6 text-[15px] leading-relaxed text-soft md:p-10"><code>{p.code}</code></pre>
          </div>
        )}
      </Reveal>

      {p.metrics && (
        <Reveal className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {p.metrics.map((m) => (
            <div key={m.label} className="rounded-2xl glass p-6">
              <b className="text-grad block font-display text-4xl font-bold tabular-nums">{m.value}</b>
              <span className="text-sm text-dim">{m.label}</span>
            </div>
          ))}
        </Reveal>
      )}

      <section className="mt-20 grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <Reveal className="grid content-start gap-5">
          <div>
            <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-dim">Role</h2>
            <p>{p.role}</p>
          </div>
          <div>
            <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-dim">Year</h2>
            <p>{p.year}</p>
          </div>
          <div>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-dim">Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span key={s} className="rounded-md border border-edge bg-white/[.02] px-2.5 py-1 font-mono text-xs text-[#A9B6D6]">{s}</span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="grid content-start gap-8">
          <div>
            <h2 className="mb-3 font-display text-2xl font-semibold">Overview</h2>
            <p className="text-lg text-soft">{p.summary}</p>
          </div>
          <div>
            <h2 className="mb-3 font-display text-2xl font-semibold">The challenge</h2>
            <p className="text-lg text-soft">{p.problem}</p>
          </div>
        </Reveal>
      </section>

      <section className="mt-20">
        <Reveal>
          <h2 className="mb-6 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight">What I built</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {p.built.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 0.08}>
              <SpotlightCard className="h-full p-6" color={`${p.accent}22`}>
                <span className="font-mono text-xs" style={{ color: p.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mb-2 mt-2 font-display text-lg font-semibold">{b.title}</h3>
                <p className="text-soft">{b.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {(desktop.length > 1 || mobile.length > 0) && (
        <section className="mt-20">
          <Reveal>
            <h2 className="mb-6 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight">Screens</h2>
          </Reveal>
          <div className="grid items-start gap-5 md:grid-cols-[1fr_auto]">
            <div className="grid gap-5">
              {desktop.slice(1).map((g) => (
                <Reveal key={g.src}>
                  <BrowserFrame url={p.live}>
                    <div className="relative aspect-[16/10]">
                      <Image src={g.src} alt={g.alt} fill sizes="(max-width: 900px) 100vw, 800px" className="object-cover object-top" />
                    </div>
                  </BrowserFrame>
                </Reveal>
              ))}
            </div>
            {mobile.map((g) => (
              <Reveal key={g.src} className="mx-auto w-[260px]">
                <PhoneFrame>
                  <div className="relative aspect-[390/844]">
                    <Image src={g.src} alt={g.alt} fill sizes="260px" className="object-cover object-top" />
                  </div>
                </PhoneFrame>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Link href={`/projects/${next.slug}/`} className="group relative mt-24 block overflow-hidden rounded-[22px] glass p-8 transition hover:border-edge-hot md:p-12">
        <span className="font-mono text-xs uppercase tracking-widest text-dim">Next project</span>
        <span className="mt-2 flex items-center justify-between gap-4 font-display text-[clamp(1.8rem,5vw,3.4rem)] font-bold tracking-tight">
          {next.title}
          <span className="text-cyan transition-transform group-hover:translate-x-2" aria-hidden="true">→</span>
        </span>
      </Link>
    </main>
  );
}
