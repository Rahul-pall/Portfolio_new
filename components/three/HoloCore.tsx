'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import { A11y } from '@react-three/a11y';
import CustomShaderMaterial from 'three-custom-shader-material';
import type CSMType from 'three-custom-shader-material/vanilla';

// The hero object: a breathing hologram sphere (custom shader on top of a
// physical material), a rotating wire shell and two orbit rings. Click or
// press Enter on it to fire a pulse.
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vPos;
  void main() {
    float d = sin(position.x * 3.0 + uTime) * sin(position.y * 3.2 + uTime * 1.3) * sin(position.z * 2.8 + uTime * 0.7);
    vec3 p = position + normal * (d * 0.09 + uPulse * 0.18 * sin(position.y * 10.0 - uTime * 8.0));
    csm_Position = p;
    vN = normalize(normalMatrix * normal);
    vV = -(modelViewMatrix * vec4(p, 1.0)).xyz;
    vPos = p;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vPos;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
    float scan = smoothstep(0.46, 0.5, fract(vPos.y * 14.0 - uTime * 0.7)) * 0.12;
    vec3 col = mix(uColorA, uColorB, fres);
    csm_DiffuseColor = vec4(col * 0.12, 0.18 + fres * 0.75);
    csm_Emissive = col * (fres * 2.2 + scan + 0.08 + uPulse * 1.5);
  }
`;

type Props = { colorA: string; colorB: string; onPulse?: () => void };

export default function HoloCore({ colorA, colorB, onPulse }: Props) {
  const mat = useRef<CSMType<typeof THREE.MeshPhysicalMaterial>>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const rings = useRef<THREE.Group>(null);
  const pulse = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  uniforms.uColorA.value.set(colorA);
  uniforms.uColorB.value.set(colorB);

  const shellGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.55, 1)), []);

  const [spring, api] = useSpring(() => ({ scale: 1, config: { mass: 1, tension: 280, friction: 12 } }));

  const fire = () => {
    pulse.current = 1;
    api.start({ from: { scale: 1.25 }, to: { scale: 1 } });
    onPulse?.();
  };

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    pulse.current = Math.max(0, pulse.current - dt * 0.9);
    uniforms.uTime.value = t;
    uniforms.uPulse.value = pulse.current;
    if (shell.current) {
      shell.current.rotation.y = t * 0.15;
      shell.current.rotation.x = t * 0.08;
    }
    if (rings.current) rings.current.rotation.z = t * 0.1;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <animated.group scale={spring.scale}>
        <A11y role="button" description="Energy core. Activate to send a pulse." actionCall={fire}>
          <mesh onClick={fire} onPointerOver={() => api.start({ scale: 1.06 })} onPointerOut={() => api.start({ scale: 1 })}>
            <icosahedronGeometry args={[1.1, 24]} />
            <CustomShaderMaterial
              ref={mat}
              baseMaterial={THREE.MeshPhysicalMaterial}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent
              roughness={0.2}
              metalness={0.1}
              depthWrite={false}
            />
          </mesh>
        </A11y>
        <lineSegments ref={shell} geometry={shellGeo}>
          <lineBasicMaterial color={colorB} transparent opacity={0.35} />
        </lineSegments>
        <group ref={rings}>
          <mesh rotation={[Math.PI / 2.3, 0, 0]}>
            <torusGeometry args={[2.1, 0.008, 8, 200]} />
            <meshBasicMaterial color={colorA} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 1.8, 0.6, 0]}>
            <torusGeometry args={[2.45, 0.005, 8, 200]} />
            <meshBasicMaterial color="#FFB547" toneMapped={false} transparent opacity={0.7} />
          </mesh>
        </group>
      </animated.group>
    </Float>
  );
}
