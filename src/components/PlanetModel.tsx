import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Planet3DConfig } from '../config/planet3DConfig';

interface PlanetSphereProps {
  config: Planet3DConfig;
  autoRotate: boolean;
  onZoomChange: (zoom: number) => void;
  controlsRef: React.RefObject<any>;
  epicTextureUrl?: string | null;
}

// Inner component inside the Canvas context
const PlanetSphere: React.FC<PlanetSphereProps> = ({ config, autoRotate, onZoomChange, controlsRef, epicTextureUrl }) => {
  const { camera } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // 1. Load Textures (PBR standard maps)
  const textureMaps: Record<string, string> = {
    map: (config.id === 'earth' && epicTextureUrl) ? epicTextureUrl : config.textureUrl
  };
  if (config.bumpMapUrl) textureMaps.bumpMap = config.bumpMapUrl;
  if (config.normalMapUrl) textureMaps.normalMap = config.normalMapUrl;
  if (config.specularMapUrl) textureMaps.specularMap = config.specularMapUrl;

  const textures = useTexture(textureMaps);
  
  // Conditionally load clouds texture for Earth
  const cloudsTexture = useTexture(config.cloudsUrl || 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

  // 2. Auto-rotation frame loop
  useFrame((_, delta) => {
    if (autoRotate) {
      if (sphereRef.current) {
        sphereRef.current.rotation.y += config.rotationSpeed * delta * 60;
      }
      if (cloudsRef.current) {
        // Clouds spin slightly faster
        cloudsRef.current.rotation.y += (config.rotationSpeed + 0.001) * delta * 60;
      }
    }
  });

  // Calculate zoom percentage based on camera distance
  const handleControlsChange = () => {
    if (camera) {
      const dist = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      // Base zoom percentage calculation (normalized around 12 units away = 100%)
      const zoomPercent = Math.round((12 / dist) * 100);
      onZoomChange(Math.min(Math.max(zoomPercent, 10), 300));
    }
  };

  return (
    <group>
      {/* 1. Primary Planet Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={textures.map}
          bumpMap={textures.bumpMap || null}
          bumpScale={0.05}
          normalMap={textures.normalMap || null}
          normalScale={new THREE.Vector2(0.15, 0.15)}
          roughness={config.id === 'earth' ? 0.4 : 0.8}
          metalness={config.id === 'earth' ? 0.1 : 0.0}
          color={config.color}
        />
      </mesh>

      {/* 2. Earth Cloud Layer (Double-sphere rendering) */}
      {config.cloudsUrl && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.53, 64, 64]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent={true}
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 3. Saturn Rings */}
      {config.hasRings && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[2.5 * (config.ringInnerRadius || 1.4), 2.5 * (config.ringOuterRadius || 2.3), 64]} />
          <meshStandardMaterial
            color={config.color}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      )}

      {/* 4. Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.05}
        maxDistance={12}
        minDistance={3.5}
        enablePan={true}
        onChange={handleControlsChange}
      />
    </group>
  );
};

// Fallback sphere shown during network asset retrieval
const FallbackSphere: React.FC<{ color: string }> = ({ color }) => {
  const fallbackRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (fallbackRef.current) fallbackRef.current.rotation.y += 0.005 * delta * 60;
  });
  return (
    <mesh ref={fallbackRef}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
};

interface PlanetModelProps {
  config: Planet3DConfig;
  autoRotate: boolean;
  onZoomChange: (zoom: number) => void;
  controlsRef: React.RefObject<any>;
  epicTextureUrl?: string | null;
}

export const PlanetModel: React.FC<PlanetModelProps> = ({ config, autoRotate, onZoomChange, controlsRef, epicTextureUrl }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      {/* Lights Setup */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={0.1} />

      {/* Suspense Wrapper to handle lazy textures */}
      <Suspense fallback={<FallbackSphere color={config.color} />}>
        <PlanetSphere
          config={config}
          autoRotate={autoRotate}
          onZoomChange={onZoomChange}
          controlsRef={controlsRef}
          epicTextureUrl={epicTextureUrl}
        />
      </Suspense>
    </Canvas>
  );
};
export default PlanetModel;
