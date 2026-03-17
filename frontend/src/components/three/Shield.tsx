"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Shield() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time / 2) * 0.3;
      meshRef.current.rotation.x = Math.cos(time / 3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 2]} />
        <MeshDistortMaterial
          color="#06b6d4"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.9}
          roughness={0.1}
          emissive="#083344"
          emissiveIntensity={2}
        />
        {/* Transparent outer glow-like shield */}
        <mesh scale={[1.1, 1.1, 1.1]}>
          <octahedronGeometry args={[1.5, 2]} />
          <meshPhongMaterial
            color="#22d3ee"
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      </mesh>
    </Float>
  );
}
