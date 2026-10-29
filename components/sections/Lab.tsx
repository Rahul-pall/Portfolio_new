'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useInView } from 'motion/react';
import SectionHead from './SectionHead';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

// A Spline scene, shown only when NEXT_PUBLIC_SPLINE_SCENE points at one
// (spline.design → Export → Code → React → copy the .splinecode URL).
export default function Lab() {
  const scene = process.env.NEXT_PUBLIC_SPLINE_SCENE;
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { once: true, margin: '300px' });
  if (!scene) return null;

  return (
    <section id="lab" className="mx-auto max-w-[1120px] px-5 pb-10 pt-28 md:px-8">
      <SectionHead eyebrow="Lab" title={<>Built in <span className="text-grad">Spline.</span></>} text="An interactive 3D scene I designed in Spline. Drag to look around." />
      <div ref={box} className="relative h-[520px] overflow-hidden rounded-[22px] border border-edge">
        {near && <Spline scene={scene} />}
      </div>
    </section>
  );
}
