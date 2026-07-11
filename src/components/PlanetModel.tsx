import React, { Suspense, useRef, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Planet3DConfig } from '../config/planet3DConfig';

// 1. Error Boundary to protect web application from WebGL context / Texture 404 load errors
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Canvas rendering caught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface PlanetSphereProps {
  config: Planet3DConfig;
  autoRotate: boolean;
  onZoomChange: (zoom: number) => void;
  controlsRef: React.RefObject<any>;
  epicTextureUrl?: string | null;
}

// 2. Earth Clouds Layer - isolated sub-component to lazily load cloud assets only when Earth is viewed
const EarthClouds: React.FC<{ config: Planet3DConfig }> = ({ config }) => {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudsTexture = useTexture(config.cloudsUrl || '');

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += (config.rotationSpeed + 0.001) * delta * 60;
    }
  });

  return (
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
  );
};

// 3. Main Planet Sphere
const PlanetSphere: React.FC<PlanetSphereProps> = ({ config, autoRotate, onZoomChange, controlsRef, epicTextureUrl }) => {
  const { camera } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);

  // Load Textures (PBR standard maps)
  const textureMaps: Record<string, string> = {
    map: (config.id === 'earth' && epicTextureUrl) ? epicTextureUrl : config.textureUrl
  };
  if (config.bumpMapUrl) textureMaps.bumpMap = config.bumpMapUrl;
  if (config.normalMapUrl) textureMaps.normalMap = config.normalMapUrl;
  if (config.specularMapUrl) textureMaps.specularMap = config.specularMapUrl;

  const textures = useTexture(textureMaps);

  // Auto-rotation frame loop
  useFrame((_, delta) => {
    if (autoRotate && sphereRef.current) {
      sphereRef.current.rotation.y += config.rotationSpeed * delta * 60;
    }
  });

  // Calculate zoom percentage based on camera distance
  const handleControlsChange = () => {
    if (camera) {
      const dist = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const zoomPercent = Math.round((12 / dist) * 100);
      onZoomChange(Math.min(Math.max(zoomPercent, 10), 300));
    }
  };

  return (
    <group>
      {/* Primary Planet Sphere */}
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

      {/* Earth Cloud Layer (Conditional lazy render) */}
      {config.cloudsUrl && <EarthClouds config={config} />}

      {/* Saturn Rings */}
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

      {/* Camera Controls */}
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
    <CanvasErrorBoundary
      fallback={
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '24px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🪐</div>
          <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, margin: '0 0 4px 0' }}>3D Asset Offline</h4>
          <p style={{ fontSize: '0.8rem', maxWidth: '320px', margin: 0, lineHeight: 1.5 }}>
            Failed to download celestial texture map telemetry. Check network coordinates.
          </p>
        </div>
      }
    >
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
    </CanvasErrorBoundary>
  );
};
export default PlanetModel;
