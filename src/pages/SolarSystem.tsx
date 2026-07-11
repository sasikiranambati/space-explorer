import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Play, Pause, ZoomIn, Info, Eye, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { SolarSystemCanvas } from '../components/SolarSystemCanvas';
import { PlanetViewer } from '../components/PlanetViewer';
import { planets as mockPlanets } from '../services/mockData';

export const SolarSystem: React.FC = () => {
  const navigate = useNavigate();

  // 1. Simulator HUD states
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Find selected planet profile from mock database
  const selectedPlanet = mockPlanets.find(
    p => p.id === selectedPlanetId?.toLowerCase()
  ) || null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
          <Eye size={12} /> WebGL Simulator
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Interactive Solar System Map
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px', margin: 0 }}>
          Drag to orbit camera. Scroll to zoom. Click on any revolving planet sphere to focus camera fly-ins.
        </p>
      </div>

      {/* Simulator HUD Controls (Speed Multipliers) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'rgba(15, 23, 42, 0.4)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Orbit Revolution:</span>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '8px' }}>
            {/* Pause */}
            <button
              onClick={() => setTimeSpeed(0)}
              style={{
                background: timeSpeed === 0 ? 'var(--color-accent)' : 'transparent',
                border: 'none',
                color: timeSpeed === 0 ? 'var(--bg-deep)' : 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Pause size={12} /> Pause
            </button>

            {/* Play 1x */}
            <button
              onClick={() => setTimeSpeed(1)}
              style={{
                background: timeSpeed === 1 ? 'var(--color-accent)' : 'transparent',
                border: 'none',
                color: timeSpeed === 1 ? 'var(--bg-deep)' : 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Play size={12} /> 1x
            </button>

            {/* Play 10x */}
            <button
              onClick={() => setTimeSpeed(10)}
              style={{
                background: timeSpeed === 10 ? 'var(--color-accent)' : 'transparent',
                border: 'none',
                color: timeSpeed === 10 ? 'var(--bg-deep)' : 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              10x
            </button>

            {/* Play 100x */}
            <button
              onClick={() => setTimeSpeed(100)}
              style={{
                background: timeSpeed === 100 ? 'var(--color-accent)' : 'transparent',
                border: 'none',
                color: timeSpeed === 100 ? 'var(--bg-deep)' : 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              100x
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <ZoomIn size={14} style={{ color: 'var(--color-accent)' }} />
          <span>Double-click model area to reset views</span>
        </div>
      </div>

      {/* Simulator canvas and Sidebar info details */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }} className="grid-responsive">
        
        {/* React Three Fiber Canvas container */}
        <GlassCard style={{ padding: '4px', overflow: 'hidden', background: '#020308', position: 'relative' }}>
          <SolarSystemCanvas
            timeSpeed={timeSpeed}
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={(id) => setSelectedPlanetId(id)}
          />
        </GlassCard>

        {/* Selected Planet Spec Sidebar card */}
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
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>Planet Characteristics</span>
              </div>

              {/* Technical Specifications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Radius</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.radius}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mass</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.mass}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gravity</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.gravity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Temperature</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.temperature}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Satellites</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedPlanet.moons?.length || 0} moons</span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                {selectedPlanet.description.split('.')[0]}.
              </p>

              {/* Bottom Buttons Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => navigate(`/explore/planet/${selectedPlanet.id}`)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    padding: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                >
                  <Compass size={16} /> View Details
                </button>

                <button
                  onClick={() => setIsViewerOpen(true)}
                  style={{
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
                  <Sparkles size={16} /> View in 3D Mode
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Info size={36} style={{ color: 'var(--color-accent)', marginBottom: '12px', opacity: 0.7 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>Planetary Dossier Empty</h4>
              <p style={{ fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                Select any revolving planetary sphere inside the WebGL orbits simulator panel to inspect its technical characteristics.
              </p>
            </GlassCard>
          )}
        </div>

      </div>

      {/* 3D Planet Viewer Immersive modal */}
      {selectedPlanet && (
        <PlanetViewer
          planetId={selectedPlanet.id}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          planetName={selectedPlanet.name}
          description={selectedPlanet.description}
          funFact={selectedPlanet.funFact}
        />
      )}

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
