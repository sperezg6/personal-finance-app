'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// ShaderPlane component with custom shader material
export function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.54, 0.36, 0.62); // Violet/indigo hue
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      vec2 uv0 = uv;
      vec3 finalColor = vec3(0.0);

      for(float i = 0.0; i < 3.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i * 0.4 + uTime * 0.1);
        d = sin(d * 8.0 + uTime) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 1.2);
        finalColor += col * d;
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[10, 10, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}

// EnergyRing component with animated rings
export function EnergyRing() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[1, 1.5, 2, 2.5].map((radius, index) => (
        <mesh key={index} rotation={[0, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.05, 64]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? '#8b5cf6' : '#6366f1'}
            transparent
            opacity={0.3 - index * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main background component
export function BackgroundPaperShaders() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ShaderPlane />
        <EnergyRing />
      </Canvas>
    </div>
  );
}
