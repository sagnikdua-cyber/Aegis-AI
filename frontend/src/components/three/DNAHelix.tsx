"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.5;
    }
  });

  const numPoints = 20;
  const radius = 1;
  const height = 4;

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {Array.from({ length: numPoints }).map((_, i) => {
        const y = (i / numPoints) * height;
        const angle = (i / numPoints) * Math.PI * 2;
        
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;

        return (
          <group key={i} position={[0, y, 0]}>
            {/* Sphere 1 */}
            <mesh position={[x1, 0, z1]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshPhongMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
            </mesh>
            
            {/* Sphere 2 */}
            <mesh position={[x2, 0, z2]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshPhongMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
            </mesh>
            
            {/* Connecting Bar */}
            <mesh position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, radius * 2]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
