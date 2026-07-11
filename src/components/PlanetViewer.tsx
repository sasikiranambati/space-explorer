import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, RotateCw, RefreshCw, Maximize2, Info, Compass,
  Sparkles
} from 'lucide-react';
import { PLANETS_3D_CONFIGS } from '../config/planet3DConfig';
import { PlanetModel } from './PlanetModel';
import { GlassCard } from './GlassCard';

interface PlanetViewerProps {
  planetId: string;
  isOpen: boolean;
  onClose: () => void;
  planetName: string;
  description: string;
  funFact?: string;
}

export const PlanetViewer: React.FC<PlanetViewerProps> = ({
  planetId,
  isOpen,
  onClose,
  planetName,
  description,
  funFact
}) => {
  const normalizedId = planetId.toLowerCase().trim();
  const config = PLANETS_3D_CONFIGS[normalizedId] || PLANETS_3D_CONFIGS.earth;

  // 1. Interactive States
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [epicTextureUrl, setEpicTextureUrl] = useState<string | null>(null);
  const [isEpicLoading, setIsEpicLoading] = useState(false);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  // 2. Fetch NASA EPIC Real Satellite Image for Earth
  React.useEffect(() => {
    if (normalizedId === 'earth' && isOpen) {
      setIsEpicLoading(true);
      fetch('https://api.nasa.gov/EPIC/api/natural/images?api_key=NJcmwGH6hTXm39CZXMWzxmMLgE1YcRp5IOagezfL')
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const latest = data[0];
            const imgName = latest.image;
            const dateStr = latest.date; // e.g. "2026-07-10 00:16:47"
            const [datePart] = dateStr.split(' ');
            const [yr, mo, dy] = datePart.split('-');
            const url = `https://api.nasa.gov/EPIC/archive/natural/${yr}/${mo}/${dy}/png/${imgName}.png?api_key=NJcmwGH6hTXm39CZXMWzxmMLgE1YcRp5IOagezfL`;
            setEpicTextureUrl(url);
          }
        })
        .catch(err => {
          console.warn('Failed to load NASA EPIC satellite photo, falling back to static map:', err);
        })
        .finally(() => {
          setIsEpicLoading(false);
        });
    } else {
      setEpicTextureUrl(null);
    }
  }, [normalizedId, isOpen]);

  // 2. Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.warn('Could not enable WebGL fullscreen:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false));
    }
  };

  // 3. Reset camera OrbitControls matrix
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setZoomPercent(100);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: 'rgba(5, 5, 15, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          {/* Main Visual Frame */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              maxWidth: '1000px',
              height: '80vh',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 30px 100px rgba(0,0,0,0.8), var(--shadow-glow)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 1. Header HUD HUD */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
                background: 'rgba(10, 15, 30, 0.4)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Interactive 3D Engine
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  {planetName}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
              >
                <X size={18} />
              </button>
            </div>

            {/* 2. Interactive Canvas Render Viewport */}
            <div style={{ flexGrow: 1, position: 'relative' }}>
              <PlanetModel
                config={config}
                autoRotate={autoRotate}
                onZoomChange={setZoomPercent}
                controlsRef={controlsRef}
                epicTextureUrl={epicTextureUrl}
              />

              {/* Suspense Spinner / Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(10, 15, 30, 0.6)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  zIndex: 5
                }}
              >
                <Compass size={14} style={{ color: 'var(--color-accent)' }} /> Drag to Orbit • Scroll to Zoom
              </div>

              {/* Live NASA Satellite Loading Status */}
              {isEpicLoading && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '260px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    color: 'var(--color-accent)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    zIndex: 5
                  }}
                >
                  <RefreshCw size={12} style={{ animation: 'spin 2s linear infinite' }} />
                  <span>Requesting Live DSCOVR Satellite Image...</span>
                </div>
              )}

              {/* Live NASA Satellite Loaded Badge */}
              {epicTextureUrl && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '260px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    fontWeight: 600,
                    zIndex: 5
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span>📡 Live NASA DSCOVR Satellite Image Loaded</span>
                </div>
              )}

              {/* Zoom Telemetry Indicator Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  background: 'rgba(10, 15, 30, 0.6)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  zIndex: 5
                }}
              >
                Sensor Zoom: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{zoomPercent}%</span>
              </div>

              {/* Info Detail Sidebar Panel Overlay */}
              <AnimatePresence>
                {showInfoPanel && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '300px',
                      zIndex: 15
                    }}
                  >
                    <GlassCard style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>Planet Facts</span>
                        <X size={14} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowInfoPanel(false)} />
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                        {description}
                      </p>
                      {funFact && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', background: 'rgba(var(--color-accent-rgb),0.05)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--color-accent)' }}>
                          <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          {funFact}
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Footer Control HUD HUD HUD */}
            <div
              style={{
                padding: '16px 24px',
                background: 'rgba(10, 15, 30, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                zIndex: 10
              }}
            >
              {/* Auto Rotate Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                style={{
                  background: autoRotate ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${autoRotate ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                  color: autoRotate ? 'var(--bg-deep)' : 'var(--text-primary)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <RotateCw size={14} />
                <span>Auto Rotate {autoRotate ? 'On' : 'Off'}</span>
              </button>

              {/* Reset Camera */}
              <button
                onClick={resetCamera}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
              >
                <RefreshCw size={14} />
                <span>Reset View</span>
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
              >
                <Maximize2 size={14} />
                <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
              </button>

              {/* Toggle Info */}
              <button
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                style={{
                  background: showInfoPanel ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${showInfoPanel ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                  color: showInfoPanel ? 'var(--bg-deep)' : 'var(--text-primary)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Info size={14} />
                <span>Info Fact</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default PlanetViewer;
