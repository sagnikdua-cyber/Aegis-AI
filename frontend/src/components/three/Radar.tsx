"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Radar() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Circular Grid */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[(i + 1) * 0.8, 0.01, 16, 100]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Rotating Sweep Beam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial 
          color="#ef4444" 
          transparent 
          opacity={0.1} 
          side={THREE.DoubleSide} 
        />
        <SweepingBeam />
      </mesh>
      
      {/* Target Points (Static for now) */}
      <TargetPoint position={[1, 0, 1]} />
      <TargetPoint position={[-1.5, 0.5, -1]} />
      <TargetPoint position={[0.5, -0.8, -2]} />
    </group>
  );
}

function SweepingBeam() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
        meshRef.current.rotation.z = -time * 2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 0.1]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
    </mesh>
  );
}

function TargetPoint({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#ef4444" />
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
      </mesh>
    </mesh>
  );
}
