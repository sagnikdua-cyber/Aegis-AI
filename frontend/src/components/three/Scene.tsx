"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, ReactNode } from "react";
import { Environment, ContactShadows } from "@react-three/drei";

export default function Scene({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
          
          {children}

          <Environment preset="city" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
