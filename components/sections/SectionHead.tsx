import Reveal from '@/components/ui/Reveal';

export default function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: React.ReactNode; text?: string }) {
  return (
    <Reveal className="mb-12 grid max-w-[660px] gap-3.5">
      <span className="font-mono text-sm text-cyan">{`// ${eyebrow}`}</span>
      <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.05] tracking-tight">{title}</h2>
      {text && <p className="text-[17px] text-dim">{text}</p>}
    </Reveal>
  );
}
