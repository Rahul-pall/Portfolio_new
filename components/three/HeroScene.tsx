'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, PointMaterial, Points, Sparkles, Stars } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { A11yAnnouncer } from '@react-three/a11y';
import { Leva, useControls } from 'leva';
import { easing, random } from 'maath';
import HoloCore from './HoloCore';

export type ScrollState = { progress: number };

// A slow-turning cloud of points, spread with maath's inSphere.
function ParticleField({ count = 2400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => random.inSphere(new Float32Array(count * 3), { radius: 6 }) as Float32Array, [count]);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x -= dt / 40;
    ref.current.rotation.y -= dt / 55;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#8B7CFF" size={0.022} sizeAttenuation depthWrite={false} toneMapped={false} />
    </Points>
  );
}

// Camera follows the pointer and dollies back as the hero scrolls away.
function CameraRig({ scroll }: { scroll: React.RefObject<ScrollState> }) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const p = scroll.current?.progress ?? 0;
    target.set(state.pointer.x * 0.8, state.pointer.y * 0.5 - p * 1.5, 6 + p * 4);
    easing.damp3(state.camera.position, target, 0.35, dt);
    state.camera.lookAt(0, -p * 1.2, 0);
  });
  return null;
}

function CoreRig({ scroll, children }: { scroll: React.RefObject<ScrollState>; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const viewportX = useRef(0);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const p = scroll.current?.progress ?? 0;
    // Sit to the right on wide screens; smaller and up top on phones, clear of the copy.
    const wide = state.size.width > 900;
    viewportX.current = wide ? 2.3 : 0.6;
    easing.damp3(ref.current.position, [viewportX.current, wide ? 0 : 2.4, -p * 2], 0.4, dt);
    const s = wide ? 1 : 0.62;
    easing.damp3(ref.current.scale, [s, s, s], 0.3, dt);
    ref.current.rotation.y = state.clock.elapsedTime * 0.1 + p * Math.PI;
  });
  return <group ref={ref}>{children}</group>;
}

const DEFAULTS = { coreA: '#4FE3FF', coreB: '#8B7CFF', bloom: 1.2, aberration: 0.0009 };
type SceneSettings = typeof DEFAULTS;

// Live tuning panel, mounted only with ?debug in the URL.
function SceneControls({ onChange }: { onChange: (s: SceneSettings) => void }) {
  const values = useControls('Hero', {
    coreA: DEFAULTS.coreA,
    coreB: DEFAULTS.coreB,
    bloom: { value: DEFAULTS.bloom, min: 0, max: 4, step: 0.1 },
    aberration: { value: DEFAULTS.aberration, min: 0, max: 0.006, step: 0.0001 },
  });
  useEffect(() => onChange(values), [values, onChange]);
  return <Leva collapsed titleBar={{ title: 'Scene controls' }} />;
}

export default function HeroScene({ scroll }: { scroll: React.RefObject<ScrollState> }) {
  const [dpr, setDpr] = useState(1.5);
  const [pulses, setPulses] = useState(0);
  const [debug, setDebug] = useState(false);
  const [{ coreA, coreB, bloom, aberration }, setSettings] = useState(DEFAULTS);
  const offset = useMemo(() => new THREE.Vector2(aberration, aberration), [aberration]);

  useEffect(() => setDebug(new URLSearchParams(location.search).has('debug')), []);

  return (
    <>
      {debug && <SceneControls onChange={setSettings} />}
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        aria-label="Interactive 3D energy core"
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={40} color="#4FE3FF" />
        <pointLight position={[-4, -2, 2]} intensity={25} color="#8B7CFF" />
        <Suspense fallback={null}>
          <Stars radius={60} depth={40} count={2500} factor={3} saturation={0} fade speed={0.6} />
          <ParticleField />
          <CoreRig scroll={scroll}>
            <HoloCore colorA={coreA} colorB={coreB} onPulse={() => setPulses((n) => n + 1)} />
            <Sparkles count={60} scale={5} size={2.2} speed={0.4} color="#FFB547" />
          </CoreRig>
        </Suspense>
        <CameraRig scroll={scroll} />
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={bloom} luminanceThreshold={0.15} luminanceSmoothing={0.3} />
          <ChromaticAberration offset={offset} blendFunction={BlendFunction.NORMAL} radialModulation={false} modulationOffset={0} />
          <Noise opacity={0.045} premultiply blendFunction={BlendFunction.ADD} />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      </Canvas>
      <A11yAnnouncer />
      <span className="sr-only" aria-live="polite">{pulses ? `Pulse ${pulses} sent` : ''}</span>
    </>
  );
}
