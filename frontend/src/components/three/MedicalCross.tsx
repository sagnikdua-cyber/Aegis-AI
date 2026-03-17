"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function MedicalCross() {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.8;
      meshRef.current.position.y = Math.sin(time) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Horizontal Bar */}
        <mesh>
          <boxGeometry args={[2, 0.6, 0.6]} />
          <MeshDistortMaterial
            color="#ef4444"
            speed={2}
            distort={0.1}
            emissive="#ef4444"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Vertical Bar */}
        <mesh>
          <boxGeometry args={[0.6, 2, 0.6]} />
          <MeshDistortMaterial
            color="#ef4444"
            speed={2}
            distort={0.1}
            emissive="#ef4444"
            emissiveIntensity={2}
          />
        </mesh>
        
        {/* Outer Glow Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}
