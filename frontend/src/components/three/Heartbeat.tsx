"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Heartbeat() {
  const lineRef = useRef<THREE.Line>(null!);
  const pointsCount = 100;
  
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < pointsCount; i++) {
      p.push(new THREE.Vector3((i / pointsCount) * 10 - 5, 0, 0));
    }
    return p;
  }, []);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = lineRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < pointsCount; i++) {
        const x = (i / pointsCount) * 10 - 5;
        // Pulse logic
        let y = 0;
        const phase = (x + time * 2) % 4;
        if (phase > 0 && phase < 0.5) {
            y = Math.sin(phase * Math.PI * 4) * 2;
        } else if (phase >= 0.5 && phase < 0.7) {
             y = -Math.sin((phase - 0.5) * Math.PI * 5);
        }

        positions[i * 3 + 1] = y * 0.5;
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group scale={[1, 1, 1]}>
      <primitive 
        object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#06b6d4", linewidth: 2, transparent: true, opacity: 0.8 }))} 
        ref={lineRef}
      />
      
      {/* Glow Effect */}
      <primitive 
        object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#06b6d4", linewidth: 4, transparent: true, opacity: 0.2 }))} 
      />
    </group>
  );
}
