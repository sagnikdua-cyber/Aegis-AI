"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const bodyParts = [
  { name: "Head", position: [0, 1.6, 0], scale: [0.35, 0.45, 0.35], type: "sphere" },
  { name: "Chest", position: [0, 0.7, 0], scale: [0.7, 0.9, 0.4], type: "box" },
  { name: "Left Arm", position: [-0.6, 0.4, 0], scale: [0.22, 1.1, 0.22], type: "cylinder", rotation: [0, 0, 0.15] },
  { name: "Right Arm", position: [0.6, 0.4, 0], scale: [0.22, 1.1, 0.22], type: "cylinder", rotation: [0, 0, -0.15] },
  { name: "Stomach / Abdomen", position: [0, -0.2, 0], scale: [0.6, 0.6, 0.35], type: "box" },
  { name: "Left Leg", position: [-0.25, -1.3, 0], scale: [0.25, 1.3, 0.25], type: "cylinder" },
  { name: "Right Leg", position: [0.25, -1.3, 0], scale: [0.25, 1.3, 0.25], type: "cylinder" },
];

export default function HumanBody({ onPartClick }: { onPartClick: (part: string) => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.15;
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.05 - 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={1.05}>
      {bodyParts.map((part) => (
        <mesh
          key={part.name}
          position={part.position as any}
          rotation={part.rotation ? (part.rotation as any) : [0, 0, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(part.name);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPartClick(part.name);
          }}
        >
          {part.type === "sphere" && <sphereGeometry args={[part.scale[0], 32, 32]} />}
          {part.type === "box" && <boxGeometry args={part.scale as any} />}
          {part.type === "cylinder" && (
            <cylinderGeometry args={[part.scale[0], part.scale[0], part.scale[1], 16]} />
          )}
          
          <meshStandardMaterial
            color={hovered === part.name ? "#22d3ee" : "#06b6d4"}
            opacity={hovered === part.name ? 0.9 : 0.3}
            transparent
            depthWrite={false}
            emissive={hovered === part.name ? "#22d3ee" : "#0284c7"}
            emissiveIntensity={hovered === part.name ? 2 : 0.5}
            roughness={0.2}
            metalness={0.8}
            wireframe={hovered !== part.name}
          />
          
          {hovered === part.name && (
            <Text
              position={[0, 0, 0.6]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {part.name}
            </Text>
          )}
        </mesh>
      ))}
      
      {/* Central neural spine line */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 3.8]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
