import BootScreen from '@/components/BootScreen';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import Projects from '@/components/sections/Projects';
import AIConsole from '@/components/sections/AIConsole';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Lab from '@/components/sections/Lab';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <BootScreen />
      <Hero />
      <Marquee />
      <Projects />
      <AIConsole />
      <Experience />
      <Skills />
      <Lab />
      <Contact />
    </main>
  );
}
