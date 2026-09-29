import { AdaptiveDpr } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import FloatingObjects from './FloatingObjects';
import Particles from './Particles';

/** Eases the whole scene toward the pointer for a subtle parallax. */
function PointerRig({ children, enabled }) {
  const group = useRef();
  useFrame((state, delta) => {
    if (!enabled) return;
    const { x, y } = state.pointer;
    const g = group.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * 0.35, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -y * 0.2, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, x * 0.25, 3, delta);
  });
  return <group ref={group}>{children}</group>;
}

/**
 * Hero 3D scene. `active` pauses rendering when the hero is off-screen,
 * `mobile` lowers geometry detail, particle count and pixel ratio.
 */
export default function HeroScene({ active = true, mobile = false }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, mobile ? 8.5 : 7], fov: 45 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} color="#e0f2fe" />
      <pointLight position={[-4, -2, 2]} intensity={40} color="#a855f7" distance={14} />
      <pointLight position={[4, 1, 3]} intensity={30} color="#22d3ee" distance={14} />
      <fog attach="fog" args={['#05060f', 8, 18]} />

      <PointerRig enabled={!mobile}>
        <FloatingObjects simplified={mobile} />
        <Particles count={mobile ? 350 : 900} />
      </PointerRig>
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
