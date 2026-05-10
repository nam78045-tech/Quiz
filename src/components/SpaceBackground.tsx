import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Nebula() {
  const points = useMemo(() => {
    const p = new Array(20).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 120,
      ],
      color: ['#8B5CF6', '#06B6D4', '#F43F5E'][Math.floor(Math.random() * 3)],
      size: Math.random() * 8 + 4,
    }));
    return p;
  }, []);

  return (
    <group>
      {points.map((p, i) => (
        <Float key={i} speed={1} rotationIntensity={1} floatIntensity={1}>
          <mesh position={p.position as any}>
            <sphereGeometry args={[p.size, 16, 16]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.02} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function UFO({ orbitRadius, speed, offset, color }: { orbitRadius: number, speed: number, offset: number, color: string }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + offset;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 0.5) * (orbitRadius * 0.3);
      ref.current.rotation.y += 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Metallic Base - Brightened */}
      <mesh>
        <cylinderGeometry args={[2.0, 2.0, 0.4, 32]} />
        <meshStandardMaterial color="#666" metalness={1} roughness={0.1} />
      </mesh>
      {/* Glowing Rim */}
      <mesh>
        <cylinderGeometry args={[2.05, 2.05, 0.15, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
      </mesh>
      {/* Translucent Glass Dome - Highly Visible */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.6} 
          metalness={1} 
          roughness={0} 
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight color={color} intensity={15} distance={30} />
    </group>
  );
}

function Moon({ orbitRadius, size, color, speed, offset }: { orbitRadius: number, size: number, color: string, speed: number, offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + offset;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 0.5) * (orbitRadius * 0.2);
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0.1} />
    </mesh>
  );
}

function Planet({ 
  orbitRadius, 
  size, 
  color, 
  speed, 
  offset, 
  ringType = 'none',
  moons = []
}: { 
  orbitRadius: number, 
  size: number, 
  color: string, 
  speed: number, 
  offset: number, 
  ringType?: 'none' | 'single' | 'double' | 'complex',
  moons?: { size: number, orbitRadius: number, speed: number, color: string }[]
}) {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const stripesRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + offset;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = Math.sin(t * 0.3) * (orbitRadius * 0.2);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (stripesRef.current) {
      stripesRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.5} 
          metalness={0.9} 
        />
      </mesh>
      
      {/* Surface Details / Stripes / Patches */}
      <mesh ref={stripesRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          wireframe={false}
          side={THREE.DoubleSide}
        />
        {/* We use a ring-like torus as fake cloud bands for more detail */}
        <mesh position={[0, size * 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.95, 0.05, 16, 64]} />
          <meshBasicMaterial color="white" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0, -size * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 0.85, 0.08, 16, 64]} />
          <meshBasicMaterial color="white" transparent opacity={0.1} />
        </mesh>
      </mesh>
      
      {/* Atmospheric Halo - More Intense */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>

      {/* Moons */}
      {moons.map((moon, idx) => (
        <Moon 
          key={idx}
          orbitRadius={size + moon.orbitRadius}
          size={moon.size}
          color={moon.color}
          speed={moon.speed}
          offset={idx * Math.PI}
        />
      ))}

      {/* Rings - Bolder and more detailed */}
      {ringType !== 'none' && (
        <group rotation={[Math.PI / 3.5, 0.4, 0]}>
          <mesh>
            <torusGeometry args={[size * 2.2, 0.03, 16, 128]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} emissive={color} emissiveIntensity={1.2} />
          </mesh>
          {(ringType === 'double' || ringType === 'complex') && (
            <mesh>
              <torusGeometry args={[size * 2.5, 0.02, 16, 128]} />
              <meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.8} />
            </mesh>
          )}
          {ringType === 'complex' && (
            <>
              <mesh>
                <torusGeometry args={[size * 1.8, 0.012, 16, 128]} />
                <meshStandardMaterial color={color} transparent opacity={0.2} emissive={color} emissiveIntensity={0.4} />
              </mesh>
              <mesh>
                <torusGeometry args={[size * 2.8, 0.04, 16, 128]} />
                <meshStandardMaterial color={color} transparent opacity={0.1} />
              </mesh>
            </>
          )}
        </group>
      )}
      
      <pointLight color={color} intensity={1.5} distance={size * 10} />
    </group>
  );
}

function AsteroidField({ count = 50 }) {
  const asteroids = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      // Avoid center area to not block text
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 160;
      // If too close to center, push it further
      const posX = Math.abs(x) < 20 ? x + (x > 0 ? 30 : -30) : x;
      const posY = Math.abs(y) < 20 ? y + (y > 0 ? 30 : -30) : y;
      
      return {
        position: [posX, posY, (Math.random() - 0.5) * 140] as [number, number, number],
        size: Math.random() * 0.4 + 0.1,
        velocity: [(Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04] as [number, number, number]
      };
    });
  }, [count]);

  return (
    <group>
      {asteroids.map((a, i) => (
        <Asteroid key={i} {...a} />
      ))}
    </group>
  );
}

function Asteroid({ position, size, velocity }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const currentPos = useRef([...position]);

  useFrame(() => {
    if (ref.current) {
      currentPos.current[0] += velocity[0];
      currentPos.current[1] += velocity[1];
      currentPos.current[2] += velocity[2];
      
      if (Math.abs(currentPos.current[0]) > 90) currentPos.current[0] *= -1;
      if (Math.abs(currentPos.current[1]) > 90) currentPos.current[1] *= -1;
      if (Math.abs(currentPos.current[2]) > 90) currentPos.current[2] *= -1;

      ref.current.position.set(currentPos.current[0], currentPos.current[1], currentPos.current[2]);
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color="#888" roughness={0.8} metalness={0.4} />
      <pointLight intensity={0.5} distance={5} color="white" />
    </mesh>
  );
}

function MovingStars() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={ref}>
      <Stars radius={250} depth={100} count={40000} factor={14} saturation={1} fade speed={1.5} />
    </group>
  );
}

function DistantStar() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={[120, 40, -180]}>
      <mesh ref={ref}>
        <sphereGeometry args={[35, 64, 64]} />
        <meshStandardMaterial 
          emissive="#FFD700" 
          emissiveIntensity={6} 
          color="#FFA500" 
          roughness={0}
        />
      </mesh>
      {/* Intense Volumetric Glow */}
      {[1.2, 1.5, 2.0, 2.8].map((scale, i) => (
        <mesh key={i} scale={[scale, scale, scale]}>
          <sphereGeometry args={[35, 32, 32]} />
          <meshBasicMaterial 
            color={i === 0 ? "#FFCC00" : i === 1 ? "#FF8800" : i === 2 ? "#FF4400" : "#FF2200"} 
            transparent 
            opacity={0.2 / (i + 1)} 
          />
        </mesh>
      ))}
      <pointLight intensity={60} distance={4000} color="#FFD700" />
    </group>
  );
}

function Flare({ position, color, size }: { position: [number, number, number], color: string, size: number }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size * 2, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <pointLight intensity={25} distance={200} color={color} />
      <mesh>
        <sphereGeometry args={[size * 0.12, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#000005]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 100]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[50, 50, 50]} intensity={3} color="#ffffff" />
        
        <DistantStar />
        <MovingStars />
        <Nebula />
        <AsteroidField count={150} />
        
        {/* Potent Distant Beacons */}
        <Flare position={[100, 70, -150]} color="#00FFFF" size={12} />
        <Flare position={[-150, -60, -200]} color="#FF0066" size={10} />
        <Flare position={[30, 130, -280]} color="#9900FF" size={8} />
        <Flare position={[-100, 150, -120]} color="#FFA500" size={9} />
        <Flare position={[180, -80, -220]} color="#00FF99" size={11} />
        
        {/* Speed-Up Planet Systems */}
        <Planet 
          orbitRadius={55} 
          size={5.5} 
          color="#BC66FF" 
          speed={0.15} 
          offset={0} 
          ringType="double"
          moons={[
            { size: 1.2, orbitRadius: 4.5, speed: 1.5, color: "#FFFFFF" }
          ]}
        />
        <Planet 
          orbitRadius={110} 
          size={9} 
          color="#33E0FF" 
          speed={0.08} 
          offset={Math.PI} 
          ringType="complex" 
          moons={[
            { size: 0.8, orbitRadius: 6, speed: 1.0, color: "#F0F0F0" },
            { size: 0.5, orbitRadius: 9, speed: 0.6, color: "#D0D0D0" }
          ]}
        />
        <Planet 
          orbitRadius={40} 
          size={3.5} 
          color="#FF5D73" 
          speed={0.3} 
          offset={Math.PI / 2} 
        />
        <Planet 
          orbitRadius={160} 
          size={8} 
          color="#4C8CFF" 
          speed={0.04} 
          offset={-Math.PI / 4} 
          ringType="single"
          moons={[
            { size: 1.5, orbitRadius: 7, speed: 1.2, color: "#E0E0E0" }
          ]}
        />

        {/* High-Visible UFOs - Differentiated Colors */}
        <UFO orbitRadius={45} speed={0.4} offset={0} color="#FFD700" />
        <UFO orbitRadius={85} speed={0.25} offset={Math.PI} color="#00FF99" />
        <UFO orbitRadius={35} speed={0.8} offset={Math.PI / 2} color="#FF66FF" />
      </Canvas>
      {/* Deep Dark but Clear Overlays */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
    </div>
  );
}
