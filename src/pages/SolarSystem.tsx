import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Compass, ZoomIn, Info, Eye } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { planets as mockPlanets } from '../services/mockData';
import type { Planet } from '../types';

export const SolarSystem: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // Width and height
    const width = mountRef.current.clientWidth;
    const height = 550; // Fixed canvas height

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 50, 95);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 20;

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff3d1, 2, 300);
    scene.add(sunLight);

    // 3. Starfield Background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 350;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 });
    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);

    // 4. Central Sun
    const sunGeometry = new THREE.SphereGeometry(7, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // 5. Planet Configurations & Mesh Creation
    const PLANET_CONFIGS = [
      { id: 'mercury', radius: 14, size: 0.45, color: 0x8a95a5, speed: 0.04 },
      { id: 'venus', radius: 20, size: 0.75, color: 0xe3bb76, speed: 0.015 },
      { id: 'earth', radius: 26, size: 0.85, color: 0x2b82c9, speed: 0.01 },
      { id: 'mars', radius: 32, size: 0.55, color: 0xc1440e, speed: 0.008 },
      { id: 'jupiter', radius: 46, size: 2.2, color: 0xb07f35, speed: 0.002 },
      { id: 'saturn', radius: 60, size: 1.8, color: 0xe2bf7d, speed: 0.0009, hasRings: true },
      { id: 'uranus', radius: 74, size: 1.25, color: 0x4b70dd, speed: 0.0004 },
      { id: 'neptune', radius: 86, size: 1.2, color: 0x274687, speed: 0.0001 }
    ];

    const planetMeshes: { mesh: THREE.Mesh; config: typeof PLANET_CONFIGS[number]; angle: number }[] = [];

    PLANET_CONFIGS.forEach(config => {
      // (a) Draw circular orbit line
      const orbitGeometry = new THREE.BufferGeometry();
      const points = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * config.radius, 0, Math.sin(theta) * config.radius));
      }
      orbitGeometry.setFromPoints(points);
      const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      // (b) Create Planet Sphere
      const geom = new THREE.SphereGeometry(config.size, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.7,
        metalness: 0.1,
        emissive: config.color,
        emissiveIntensity: 0.1
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = config.id;
      scene.add(mesh);

      // (c) Saturn Rings
      if (config.hasRings) {
        const ringGeom = new THREE.RingGeometry(config.size * 1.3, config.size * 2.1, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xd2b48c, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2.2;
        mesh.add(ring);
      }

      planetMeshes.push({
        mesh,
        config,
        angle: Math.random() * Math.PI * 2 // Random initial orbit angles
      });
    });

    // 6. Raycasting Intersections
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      // Calculate coordinates relative to canvas
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetMeshes.map(pm => pm.mesh));

      if (intersects.length > 0) {
        const clickedMeshName = intersects[0].object.name;
        const matchingPlanet = mockPlanets.find(p => p.id === clickedMeshName);
        if (matchingPlanet) {
          setSelectedPlanet(matchingPlanet);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate Sun
      sun.rotation.y += 0.002;

      // Orbit and self-rotate planets
      planetMeshes.forEach(pm => {
        pm.angle += pm.config.speed;
        
        // Translate along orbital circle
        pm.mesh.position.x = Math.cos(pm.angle) * pm.config.radius;
        pm.mesh.position.z = Math.sin(pm.angle) * pm.config.radius;

        // Rotate planet on axis
        pm.mesh.rotation.y += 0.01;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Clean up WebGL Contexts
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.removeEventListener('click', handleCanvasClick);
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
          <Eye size={12} /> WebGL Simulator
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Interactive Solar System Map
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px', margin: 0 }}>
          Drag to rotate the viewport camera. Scroll to zoom in and out. Click on a planetary sphere to view technical specs.
        </p>
      </div>

      {/* 2. Visual Simulator Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }} className="grid-responsive">
        
        {/* WebGL Canvas Render Port */}
        <GlassCard style={{ padding: '8px', overflow: 'hidden', background: '#020308', position: 'relative' }}>
          <div ref={mountRef} style={{ width: '100%', height: '550px', cursor: 'grab' }} />
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px', background: 'rgba(10,15,30,0.7)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <ZoomIn size={12} /> Drag camera to view orbits
          </div>
        </GlassCard>

        {/* Selected Planet Sidebar */}
        <div>
          {selectedPlanet ? (
            <GlassCard style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <img
                  src={selectedPlanet.image}
                  alt={selectedPlanet.name}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
                />
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{selectedPlanet.name}</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{selectedPlanet.category} Details</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Radius</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.radius}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gravity</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.gravity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Temperature</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.temperature}</span>
                </div>
                {selectedPlanet.escapeVelocity && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Escape Velocity</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.escapeVelocity}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Satellites</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.moons?.length || 0} moons</span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                {selectedPlanet.description.split('.')[0]}.
              </p>

              <button
                onClick={() => navigate(`/explore/planet/${selectedPlanet.id}`)}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  background: 'var(--color-accent)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'var(--bg-deep)',
                  padding: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.filter = 'none')}
              >
                <Compass size={16} /> Inspect Dashboard
              </button>
            </GlassCard>
          ) : (
            <GlassCard style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Info size={36} style={{ color: 'var(--color-accent)', marginBottom: '12px', opacity: 0.7 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>Planetary Dossier Empty</h4>
              <p style={{ fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                Select any rotating planetary sphere inside the WebGL simulator panel to inspect its real-time specs profiles.
              </p>
            </GlassCard>
          )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

    </div>
  );
};
export default SolarSystem;
