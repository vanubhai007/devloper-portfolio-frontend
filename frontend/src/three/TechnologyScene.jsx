import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/** Evenly distributes n points on a sphere (Fibonacci lattice). */
function fibonacciSphere(n, radius) {
  const points = [];
  const offset = 2 / n;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    points.push(new THREE.Vector3(Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius));
  }
  return points;
}

const tmp = new THREE.Vector3();

/** An HTML label that fades as it rotates to the back of the sphere. */
function Label({ position, name, radius }) {
  const ref = useRef();
  const anchor = useRef();
  useFrame(() => {
    if (!ref.current || !anchor.current) return;
    anchor.current.getWorldPosition(tmp);
    const t = (tmp.z + radius) / (2 * radius); // 0 (back) → 1 (front)
    ref.current.style.opacity = String(0.15 + t * 0.85);
    ref.current.style.transform = `scale(${0.75 + t * 0.35})`;
  });
  return (
    <group ref={anchor} position={position}>
      <Html center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <span ref={ref} className="tech-label">
          {name}
        </span>
      </Html>
    </group>
  );
}

function Cloud({ items, radius }) {
  const group = useRef();
  const points = useMemo(() => fibonacciSphere(items.length, radius), [items.length, radius]);
  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.12;
  });
  return (
    <group ref={group}>
      {items.map((name, i) => (
        <Label key={name} name={name} position={points[i]} radius={radius} />
      ))}
      <mesh>
        <icosahedronGeometry args={[radius * 0.62, 2]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.3, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/** Rotating 3D cloud of technology names. Drag to rotate on desktop. */
export default function TechnologyScene({ items, active = true, interactive = true }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9.5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <Cloud items={items} radius={2.9} />
      {interactive && <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />}
    </Canvas>
  );
}
