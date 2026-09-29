import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
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
const LABEL_HEIGHT = 0.42; // world units

/** Draws a neon "pill" label onto a canvas and returns it as a texture. */
function createLabelTexture(text) {
  const scale = 4; // render at high resolution for crisp text
  const fontSize = 26 * scale;
  const padX = 22 * scale;
  const height = 50 * scale;
  const font = `500 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width + padX * 2);
  canvas.width = width;
  canvas.height = height;

  const r = height / 2;
  const lw = 2 * scale;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(lw, lw, width - lw * 2, height - lw * 2, r - lw);
  else ctx.rect(lw, lw, width - lw * 2, height - lw * 2);
  ctx.fillStyle = 'rgba(5, 6, 15, 0.82)';
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)';
  ctx.stroke();

  ctx.font = font;
  ctx.fillStyle = '#e8ecf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2 + scale);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, aspect: width / height };
}

/**
 * A camera-facing sprite label that fades and shrinks as it rotates to the
 * back of the sphere. Pure Three.js — no DOM nodes, no per-frame layout.
 */
function Label({ position, name, radius }) {
  const sprite = useRef();
  const { texture, aspect } = useMemo(() => createLabelTexture(name), [name]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    const s = sprite.current;
    s.getWorldPosition(tmp);
    const t = (tmp.z + radius) / (2 * radius); // 0 (back) → 1 (front)
    const size = LABEL_HEIGHT * (0.75 + t * 0.35);
    s.scale.set(size * aspect, size, 1);
    s.material.opacity = 0.15 + t * 0.85;
    s.renderOrder = Math.round(t * 100);
  });

  return (
    <sprite ref={sprite} position={position}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
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
