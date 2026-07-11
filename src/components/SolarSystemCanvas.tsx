import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasErrorBoundary } from './PlanetModel';

interface PlanetConfig {
  id: string;
  name: string;
  radius: number; // Orbital distance
  size: number;   // Planet sphere radius
  color: number;
  speed: number;  // Base revolution speed
  textureUrl: string;
  hasRings?: boolean;
}

const PLANET_CONFIGS: PlanetConfig[] = [
  { id: 'mercury', name: 'Mercury', radius: 14, size: 0.45, color: 0x8a95a5, speed: 0.04, textureUrl: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/mercurymap.jpg' },
  { id: 'venus', name: 'Venus', radius: 20, size: 0.75, color: 0xe3bb76, speed: 0.015, textureUrl: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/venusmap.jpg' },
  { id: 'earth', name: 'Earth', radius: 26, size: 0.85, color: 0x2b82c9, speed: 0.01, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg' },
  { id: 'mars', name: 'Mars', radius: 32, size: 0.55, color: 0xc1440e, speed: 0.008, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_color.jpg' },
  { id: 'jupiter', name: 'Jupiter', radius: 46, size: 2.2, color: 0xb07f35, speed: 0.002, textureUrl: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/jupitermap.jpg' },
  { id: 'saturn', name: 'Saturn', radius: 60, size: 1.8, color: 0xe2bf7d, speed: 0.0009, hasRings: true, textureUrl: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnmap.jpg' },
  { id: 'uranus', name: 'Uranus', radius: 74, size: 1.25, color: 0x4b70dd, speed: 0.0004, textureUrl: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusmap.jpg' },
  { id: 'neptune', name: 'Neptune', radius: 86, size: 1.2, color: 0x274687, speed: 0.0001, textureUrl: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/neptunemap.jpg' }
];

// 1. Single Planet Node (revolves and self-spins)
interface PlanetNodeProps {
  config: PlanetConfig;
  timeSpeed: number;
  onSelectPlanet: (id: string, groupRef: React.RefObject<THREE.Group | null>) => void;
  isSelected: boolean;
}

const PlanetNode: React.FC<PlanetNodeProps> = ({ config, timeSpeed, onSelectPlanet, isSelected }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  // Load Planet texture
  const texture = useTexture(config.textureUrl);

  useFrame((_, delta) => {
    // Revolution around Sun
    angleRef.current += config.speed * delta * timeSpeed * 30; // Scale speed for R3F frame delta
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * config.radius;
      groupRef.current.position.z = Math.sin(angleRef.current) * config.radius;
    }

    // Self-spin on Axis
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * delta * 60;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Clickable Planet Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet(config.id, groupRef);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[config.size, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.1}
          emissive={isSelected ? config.color : 0x000000}
          emissiveIntensity={isSelected ? 0.3 : 0.0}
        />
      </mesh>

      {/* Saturn rings */}
      {config.hasRings && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[config.size * 1.3, config.size * 2.3, 64]} />
          <meshStandardMaterial
            color={config.color}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.65}
          />
        </mesh>
      )}
    </group>
  );
};

// 2. Camera Focus Controller to smoothly move views
interface FocusControllerProps {
  focusedPlanetRef: React.RefObject<THREE.Group | null> | null;
  controlsRef: React.RefObject<any>;
  isFocused: boolean;
  selectedPlanetSize: number;
}

const CameraFocusController: React.FC<FocusControllerProps> = ({
  focusedPlanetRef,
  controlsRef,
  isFocused,
  selectedPlanetSize
}) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (isFocused && focusedPlanetRef?.current && controlsRef.current) {
      const targetPos = new THREE.Vector3();
      focusedPlanetRef.current.getWorldPosition(targetPos);

      // Lerp OrbitControls target to look directly at the planet
      controlsRef.current.target.lerp(targetPos, 0.05 * delta * 60);

      // Lerp camera position to sit near the planet
      // Scale camera offset relative to the size of the planet so we don't clip!
      const cameraOffset = new THREE.Vector3(0, selectedPlanetSize * 1.8 + 2.5, selectedPlanetSize * 2.5 + 4.5);
      const desiredCameraPos = targetPos.clone().add(cameraOffset);
      camera.position.lerp(desiredCameraPos, 0.05 * delta * 60);

      controlsRef.current.update();
    }
  });

  return null;
};

// Fallback sphere during loading
const SunFallback: React.FC = () => (
  <mesh>
    <sphereGeometry args={[5, 16, 16]} />
    <meshBasicMaterial color={0xffaa00} />
  </mesh>
);

// 3. Main Canvas wrapper
interface SolarSystemCanvasProps {
  timeSpeed: number;
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string | null, groupRef: React.RefObject<THREE.Group | null> | null) => void;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  timeSpeed,
  selectedPlanetId,
  onSelectPlanet
}) => {
  const controlsRef = useRef<any>(null);
  const [activePlanetRef, setActivePlanetRef] = useState<React.RefObject<THREE.Group | null> | null>(null);

  // Find size of selected planet
  const selectedConfig = PLANET_CONFIGS.find(p => p.id === selectedPlanetId);
  const selectedPlanetSize = selectedConfig ? selectedConfig.size : 1.0;

  const handleSelectPlanet = (id: string, groupRef: React.RefObject<THREE.Group | null>) => {
    setActivePlanetRef(groupRef);
    onSelectPlanet(id, groupRef);
  };

  // Break camera lock when manual navigation starts
  const handleManualControl = () => {
    if (selectedPlanetId !== null) {
      onSelectPlanet(null, null);
      setActivePlanetRef(null);
    }
  };

  return (
    <CanvasErrorBoundary
      fallback={
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          🪐 Solar System WebGL Context Failed to Load.
        </div>
      }
    >
      <Canvas
        camera={{ position: [0, 60, 110], fov: 50 }}
        style={{ width: '100%', height: '550px', background: '#020308' }}
      >
        {/* Environment Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 50, 0]} intensity={1.5} />
        <pointLight position={[0, 0, 0]} intensity={4.0} distance={300} decay={1.0} />

        {/* Background Starfields */}
        <Stars radius={150} depth={50} count={3500} factor={4} saturation={0.5} fade speed={1.5} />

        <Suspense fallback={<SunFallback />}>
          {/* Centered Sun */}
          <group>
            <mesh>
              <sphereGeometry args={[5.5, 32, 32]} />
              <meshBasicMaterial color={0xffaa00} />
            </mesh>
          </group>

          {/* Orbits Loops & Revolving Planet spheres */}
          {PLANET_CONFIGS.map(config => {
            // Render subtle blue orbit ring path
            const points = [];
            const segments = 128;
            for (let i = 0; i <= segments; i++) {
              const theta = (i / segments) * Math.PI * 2;
              points.push(new THREE.Vector3(Math.cos(theta) * config.radius, 0, Math.sin(theta) * config.radius));
            }
            const orbitGeom = new THREE.BufferGeometry().setFromPoints(points);

            return (
              <group key={config.id}>
                {/* Orbital Ring Line using primitive to avoid SVG line tag typings clash */}
                <primitive object={new THREE.Line(orbitGeom, new THREE.LineBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.12 }))} />

                {/* Interactive Planet Node */}
                <PlanetNode
                  config={config}
                  timeSpeed={timeSpeed}
                  onSelectPlanet={handleSelectPlanet}
                  isSelected={selectedPlanetId === config.id}
                />
              </group>
            );
          })}

          {/* Smooth focus fly-in controls */}
          <CameraFocusController
            focusedPlanetRef={activePlanetRef}
            controlsRef={controlsRef}
            isFocused={selectedPlanetId !== null}
            selectedPlanetSize={selectedPlanetSize}
          />
        </Suspense>

        {/* User Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          maxDistance={220}
          minDistance={12}
          onStart={handleManualControl}
        />
      </Canvas>
    </CanvasErrorBoundary>
  );
};
export default SolarSystemCanvas;
