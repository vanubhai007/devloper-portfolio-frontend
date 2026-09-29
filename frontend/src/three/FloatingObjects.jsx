import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const CYAN = '#22d3ee';
const VIOLET = '#a855f7';
const BLUE = '#3b82f6';

/** Small satellites that orbit the core at different speeds. */
const SATELLITES = [
  { geo: 'octa', pos: [2.9, 1.2, -0.6], color: CYAN, scale: 0.28, speed: 1.4 },
  { geo: 'box', pos: [-2.8, -0.9, 0.4], color: VIOLET, scale: 0.26, speed: 1.1 },
  { geo: 'tetra', pos: [-2.1, 1.7, -1.2], color: BLUE, scale: 0.3, speed: 1.7 },
  { geo: 'torus', pos: [2.3, -1.6, 0.8], color: VIOLET, scale: 0.22, speed: 1.2 },
  { geo: 'octa', pos: [0.4, 2.3, -1.8], color: BLUE, scale: 0.18, speed: 2 },
];

function SatelliteGeometry({ type }) {
  switch (type) {
    case 'box':
      return <boxGeometry args={[1, 1, 1]} />;
    case 'tetra':
      return <tetrahedronGeometry args={[1, 0]} />;
    case 'torus':
      return <torusGeometry args={[1, 0.35, 12, 32]} />;
    default:
      return <octahedronGeometry args={[1, 0]} />;
  }
}

export default function FloatingObjects({ simplified = false }) {
  const core = useRef();
  const cage = useRef();
  const ringA = useRef();
  const ringB = useRef();

  useFrame((_, delta) => {
    core.current.rotation.y += delta * 0.25;
    cage.current.rotation.y -= delta * 0.12;
    cage.current.rotation.x += delta * 0.06;
    ringA.current.rotation.z += delta * 0.2;
    ringB.current.rotation.z -= delta * 0.14;
  });

  return (
    <group>
      {/* Glowing distorted core */}
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, simplified ? 3 : 8]} />
          <MeshDistortMaterial
            color="#0b1026"
            emissive={BLUE}
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.9}
            distort={0.35}
            speed={1.6}
          />
        </mesh>
      </Float>

      {/* Wireframe cage */}
      <mesh ref={cage}>
        <icosahedronGeometry args={[1.75, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.28} />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.35, 0.012, 8, 160]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.7} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.4, 0]}>
        <torusGeometry args={[2.7, 0.008, 8, 160]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.55} />
      </mesh>

      {!simplified &&
        SATELLITES.map((s, i) => (
          <Float key={i} speed={s.speed} rotationIntensity={1.2} floatIntensity={1.1}>
            <mesh position={s.pos} scale={s.scale}>
              <SatelliteGeometry type={s.geo} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={0.6}
                roughness={0.3}
                metalness={0.6}
                wireframe={i % 2 === 1}
              />
            </mesh>
          </Float>
        ))}
    </group>
  );
}
