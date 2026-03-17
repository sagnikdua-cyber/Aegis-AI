"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Hologram() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group scale={1.2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#22d3ee"
          speed={4}
          distort={0.3}
          radius={1}
          metalness={1}
          roughness={0}
          transparent
          opacity={0.6}
          emissive="#06b6d4"
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Outer rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[1.7, 0.01, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
