'use client';

import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { CuboidCollider, Physics, RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { skills } from '@/lib/data';

const COLORS: Record<string, string> = {
  Frontend: '#4FE3FF',
  Backend: '#8B7CFF',
  'Data & AI': '#FFB547',
  DevOps: '#3DF59A',
};
const FONT = '/fonts/JetBrainsMono-Medium.ttf';

type Tile = { label: string; color: string; w: number; pos: [number, number, number] };

// Seeded so every visit drops the tiles the same way.
function seeded(i: number) {
  const x = Math.sin(i * 99.13) * 43758.5453;
  return x - Math.floor(x);
}

function SkillTile({ tile, bodies, index }: { tile: Tile; bodies: React.RefObject<(RapierRigidBody | null)[]>; index: number }) {
  return (
    <RigidBody
      ref={(b) => { bodies.current[index] = b; }}
      position={tile.pos}
      rotation={[0, 0, (seeded(index + 7) - 0.5) * 0.8]}
      colliders="cuboid"
      restitution={0.35}
      friction={0.7}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
    >
      <group
        onPointerDown={(e) => {
          e.stopPropagation();
          bodies.current[index]?.applyImpulse({ x: (seeded(index) - 0.5) * 6, y: 14, z: 0 }, true);
          bodies.current[index]?.applyTorqueImpulse({ x: 0, y: 0, z: (seeded(index + 3) - 0.5) * 2 }, true);
        }}
      >
        <RoundedBox args={[tile.w, 0.62, 0.4]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#0E1424" metalness={0.4} roughness={0.35} emissive={tile.color} emissiveIntensity={0.08} />
        </RoundedBox>
        <mesh position={[0, -0.3, 0.205]}>
          <planeGeometry args={[tile.w - 0.2, 0.025]} />
          <meshBasicMaterial color={tile.color} toneMapped={false} />
        </mesh>
        <Text font={FONT} fontSize={0.24} color={tile.color} anchorX="center" anchorY="middle" position={[0, 0.02, 0.21]}>
          {tile.label}
        </Text>
      </group>
    </RigidBody>
  );
}

// An invisible ball that follows the pointer and shoves tiles out of the way.
function Pusher() {
  const body = useRef<RapierRigidBody>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ pointer, viewport }) => {
    v.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0);
    body.current?.setNextKinematicTranslation(v);
  });
  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[0, 50, 0]}>
      <BallCollider args={[0.55]} />
    </RigidBody>
  );
}

function Box() {
  const { viewport } = useThree();
  const w = viewport.width / 2;
  const h = viewport.height / 2;
  return (
    <>
      <CuboidCollider position={[0, -h - 0.5, 0]} args={[w + 2, 0.5, 2]} />
      <CuboidCollider position={[-w - 0.5, 0, 0]} args={[0.5, h * 4, 2]} />
      <CuboidCollider position={[w + 0.5, 0, 0]} args={[0.5, h * 4, 2]} />
    </>
  );
}

function Scene({ shake }: { shake: React.RefObject<(() => void) | null> }) {
  const { viewport } = useThree();
  const bodies = useRef<(RapierRigidBody | null)[]>([]);

  const tiles = useMemo<Tile[]>(() => {
    const list: Tile[] = [];
    let i = 0;
    for (const [group, items] of Object.entries(skills)) {
      for (const label of items) {
        const width = Math.max(1.3, label.length * 0.17 + 0.6);
        list.push({
          label,
          color: COLORS[group],
          w: width,
          pos: [(seeded(i) - 0.5) * (viewport.width - width - 0.4), viewport.height / 2 + 1 + i * 0.75, 0],
        });
        i++;
      }
    }
    return list;
    // Positions are only used for the first drop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  shake.current = () => {
    bodies.current.forEach((b, i) => b?.applyImpulse({ x: (seeded(i + Date.now() % 97) - 0.5) * 8, y: 10 + seeded(i) * 8, z: 0 }, true));
  };

  return (
    <Physics gravity={[0, -14, 0]}>
      <Box />
      <Pusher />
      {tiles.map((t, i) => (
        <SkillTile key={t.label} tile={t} bodies={bodies} index={i} />
      ))}
    </Physics>
  );
}

export default function SkillsPhysics({ shake }: { shake: React.RefObject<(() => void) | null> }) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 40 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} aria-label="Skill tiles in a physics box. Click a tile to throw it.">
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <pointLight position={[-4, 2, 4]} intensity={20} color="#8B7CFF" />
      <Suspense fallback={null}>
        <Scene shake={shake} />
      </Suspense>
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.4} />
      </EffectComposer>
    </Canvas>
  );
}
