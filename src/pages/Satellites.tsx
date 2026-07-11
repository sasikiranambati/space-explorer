import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio, Navigation, Search, Orbit, Clock
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { SectionTitle } from '../components/SectionTitle';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

interface Satellite {
  id: string;
  name: string;
  category: string;
  altitude: number; // km
  speed: number;    // km/h
  inclination: number; // degrees
  period: number;   // minutes
  type: 'iss' | 'science' | 'telecom';
  description: string;
  launchDate: string;
  status: string;
}

const SATELLITES: Satellite[] = [
  {
    id: 'iss',
    name: 'International Space Station (ISS)',
    category: 'ISS',
    altitude: 422,
    speed: 27560,
    inclination: 51.64,
    period: 92.9,
    type: 'iss',
    description: 'A habitable artificial satellite in low Earth orbit. It serves as a microgravity and space environment research laboratory in which crew members conduct experiments in biology, physics, and meteorology.',
    launchDate: 'November 20, 1998',
    status: 'Operational'
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    category: 'Science',
    altitude: 535,
    speed: 27300,
    inclination: 28.47,
    period: 95.4,
    type: 'science',
    description: 'Launched into low Earth orbit in 1990, Hubble is one of the largest and most versatile space telescopes. It has made over 1.5 million observations, transforming our understanding of the universe\'s age and expansion.',
    launchDate: 'April 24, 1990',
    status: 'Operational'
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope (JWST)',
    category: 'Science',
    altitude: 1500000, // Orbits L2
    speed: 720,
    inclination: 37.5, // Relative orbital inclination to ecliptic
    period: 250000,
    type: 'science',
    description: 'The premier space observatory of the decade. Unlike Hubble, JWST resides in a halo orbit around the Second Lagrange Point (L2), 1.5 million kilometers from Earth, looking deep into the infrared spectrum.',
    launchDate: 'December 25, 2021',
    status: 'Operational'
  },
  {
    id: 'starlink-5309',
    name: 'Starlink-5309 (Constellation)',
    category: 'Telecom',
    altitude: 550,
    speed: 27000,
    inclination: 53.05,
    period: 95.6,
    type: 'telecom',
    description: 'Part of SpaceX\'s massive satellite constellation designed to deliver high-speed, low-latency broadband internet coverage to remote and underserved locations across the globe.',
    launchDate: 'March 14, 2023',
    status: 'Operational'
  },
  {
    id: 'starlink-5312',
    name: 'Starlink-5312 (Constellation)',
    category: 'Telecom',
    altitude: 548,
    speed: 27050,
    inclination: 53.05,
    period: 95.5,
    type: 'telecom',
    description: 'A sister node in the Starlink orbital shell, contributing to the globally distributed network matrix for satellite communications.',
    launchDate: 'April 19, 2023',
    status: 'Operational'
  }
];

// Simplified boundary calculation for countries
function getCountryOver(lat: number, lon: number): string {
  if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -70) return 'United States';
  if (lat >= 50 && lat <= 80 && lon >= -140 && lon <= -50) return 'Canada';
  if (lat >= -30 && lat <= 5 && lon >= -70 && lon <= -35) return 'Brazil';
  if (lat >= -40 && lat <= -10 && lon >= 113 && lon <= 153) return 'Australia';
  if (lat >= 50 && lat <= 80 && lon >= 30 && lon <= 180) return 'Russia';
  if (lat >= 20 && lat <= 50 && lon >= 75 && lon <= 130) return 'China';
  if (lat >= 8 && lat <= 35 && lon >= 68 && lon <= 97) return 'India';
  if (lat >= 36 && lat <= 70 && lon >= -10 && lon <= 40) return 'Europe';
  if (lat >= -35 && lat <= 35 && lon >= -15 && lon <= 50) return 'Africa';
  
  if (lon >= -40 && lon <= -15 && lat >= -50 && lat <= 60) return 'North Atlantic Ocean';
  if (lon >= -40 && lon <= -15 && lat < -50) return 'South Atlantic Ocean';
  if (lon >= 40 && lon <= 110 && lat < 10) return 'Indian Ocean';
  if (lat >= 60) return 'Arctic Ocean';
  if (lat <= -60) return 'Southern Ocean';
  return 'Pacific Ocean';
}

function getSatellitePosition(satId: string, timeMs: number) {
  const t = timeMs / 1000;

  if (satId === 'jwst') {
    // Slow halo orbit around L2 point coordinates (arbitrary center offset for visual tracking)
    const periodSec = 180 * 24 * 3600; // 6 months
    const angle = (2 * Math.PI * t) / periodSec;
    return {
      lat: -15 + 8 * Math.sin(angle),
      lon: -45 + 12 * Math.cos(angle)
    };
  }

  const sat = SATELLITES.find(s => s.id === satId);
  if (!sat) return { lat: 0, lon: 0 };

  const periodSec = sat.period * 60;
  const inclinationRad = (sat.inclination * Math.PI) / 180;

  // Add offset based on ID to separate satellite timelines
  const idOffset = satId.charCodeAt(0) * 1000;
  const orbitalAngle = (2 * Math.PI * (t + idOffset)) / periodSec;

  const z = Math.sin(orbitalAngle) * Math.sin(inclinationRad);
  const y = Math.sin(orbitalAngle) * Math.cos(inclinationRad);
  const x = Math.cos(orbitalAngle);

  const lat = Math.asin(z) * (180 / Math.PI);
  const earthRotationSpeed = (2 * Math.PI) / 86400; // radians/sec
  let lonRad = Math.atan2(y, x) - earthRotationSpeed * (t + idOffset);

  lonRad = ((lonRad + Math.PI) % (2 * Math.PI)) - Math.PI;
  if (lonRad < -Math.PI) lonRad += 2 * Math.PI;

  const lon = lonRad * (180 / Math.PI);

  return { lat, lon };
}

export const Satellites: React.FC = () => {
  const [selectedSatId, setSelectedSatId] = useState<string>('iss');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeMs, setTimeMs] = useState<number>(Date.now());
  const [syncCountdown, setSyncCountdown] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [liveCoords, setLiveCoords] = useState<Record<string, { lat: number; lon: number; altitude: number; speed: number }>>({});

  // Initial mock loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Live coordinates fetch from api.wheretheiss.at
  useEffect(() => {
    const fetchLiveCoords = async () => {
      try {
        const issRes = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (issRes.ok) {
          const data = await issRes.json();
          setLiveCoords(prev => ({
            ...prev,
            iss: {
              lat: Number(data.latitude),
              lon: Number(data.longitude),
              altitude: Number(data.altitude),
              speed: Number(data.velocity)
            }
          }));
        }
      } catch (err) {
        console.warn('ISS live coordinates offline:', err);
      }

      try {
        const hubbleRes = await fetch('https://api.wheretheiss.at/v1/satellites/20580');
        if (hubbleRes.ok) {
          const data = await hubbleRes.json();
          setLiveCoords(prev => ({
            ...prev,
            hubble: {
              lat: Number(data.latitude),
              lon: Number(data.longitude),
              altitude: Number(data.altitude),
              speed: Number(data.velocity)
            }
          }));
        }
      } catch (err) {
        console.warn('Hubble live coordinates offline:', err);
      }
    };

    fetchLiveCoords();
    const interval = setInterval(fetchLiveCoords, 10000); // refresh API coordinates every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Update time and countdown
  useEffect(() => {
    // 1-second telemetry clock ticks
    const interval = setInterval(() => {
      setTimeMs(Date.now());
      setSyncCountdown(prev => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectedSat = SATELLITES.find(s => s.id === selectedSatId) || SATELLITES[0];
  
  // Use live API coords if available for selected satellite
  const hasLive = liveCoords[selectedSat.id];
  const currentPos = hasLive 
    ? { lat: hasLive.lat, lon: hasLive.lon }
    : getSatellitePosition(selectedSat.id, timeMs);

  const speedVal = hasLive ? hasLive.speed : selectedSat.speed;
  const altitudeVal = hasLive ? hasLive.altitude : selectedSat.altitude;
  const currentCountry = getCountryOver(currentPos.lat, currentPos.lon);

  // Generate orbit path points
  const generateOrbitPoints = (satId: string) => {
    const sat = SATELLITES.find(s => s.id === satId);
    if (!sat) return [];

    const points = [];
    const periodSec = sat.period * 60;
    const steps = 120; // Resolution of orbit path line

    for (let i = 0; i <= steps; i++) {
      const offsetSec = (periodSec * i) / steps;
      // Calculate backward path
      const pos = getSatellitePosition(satId, timeMs - offsetSec * 1000);
      points.push(pos);
    }
    return points;
  };

  const orbitPoints = generateOrbitPoints(selectedSat.id);

  // Map latitude/longitude to SVG viewport percentage
  // SVG viewport dimensions: x [-180, 180] maps to [0, 100%], y [90, -90] maps to [0, 100%]
  const mapCoordsToPercent = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  // Convert points to SVG segment lines to avoid border wraps
  const getOrbitPathsSvg = () => {
    const paths: { d: string }[] = [];
    let currentPath = '';

    orbitPoints.forEach((pt, idx) => {
      const { x, y } = mapCoordsToPercent(pt.lat, pt.lon);
      if (idx === 0) {
        currentPath = `M ${x} ${y}`;
      } else {
        const prev = orbitPoints[idx - 1];
        // Split path if crossing boundary
        if (Math.abs(pt.lon - prev.lon) > 180) {
          paths.push({ d: currentPath });
          currentPath = `M ${x} ${y}`;
        } else {
          currentPath += ` L ${x} ${y}`;
        }
      }
    });

    if (currentPath) {
      paths.push({ d: currentPath });
    }

    return paths;
  };

  const paths = getOrbitPathsSvg();
  const currentPosPercent = mapCoordsToPercent(currentPos.lat, currentPos.lon);

  // Generate dynamic pass schedules based on time
  const generatePasses = (sat: Satellite) => {
    const passes = [];
    const stepMin = sat.period; // Next orbits
    const baseTime = timeMs;

    for (let i = 1; i <= 4; i++) {
      const passTime = new Date(baseTime + i * stepMin * 60 * 1000);
      const durationSec = Math.floor(200 + Math.random() * 200);
      const durationMin = Math.floor(durationSec / 60);
      const durationRemSec = durationSec % 60;
      const elevation = Math.floor(15 + Math.random() * 70);

      passes.push({
        time: passTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: passTime.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        duration: `${durationMin}m ${durationRemSec}s`,
        elevation: `${elevation}°`
      });
    }
    return passes;
  };

  const passes = generatePasses(selectedSat);

  // Filtering Satellites list
  const filteredSats = SATELLITES.filter(sat => {
    const matchesSearch = sat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sat.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || sat.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Tracked' },
    { value: 'iss', label: 'Space Stations' },
    { value: 'science', label: 'Observatories' },
    { value: 'telecom', label: 'Constellations' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <SectionTitle
          title="Satellite Telemetry Center"
          subtitle="Real-time orbital tracking visualizer for space assets in Earth & Lagrangian orbits."
        />

        {/* Sync Countdown Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '8px 14px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <Clock size={14} style={{ color: 'var(--color-accent)' }} />
          <span>Auto-refreshed in: <strong>{syncCountdown}s</strong></span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div style={{ padding: '60px 0' }}>
            <LoadingSkeleton variant="details" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="sat-grid">
            
            {/* Map & List Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* World Map Wrapper */}
              <GlassCard hoverScale={false} style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {/* Visual Header */}
                <div style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'rgba(10, 15, 30, 0.6)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={16} className="radar-ping" style={{ color: 'var(--color-accent)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Telemetry Live Radar Map
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <span>Synchronized</span>
                  </div>
                </div>

                {/* Styled Equirectangular Map Container */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#030712' }}>
                  {/* Glowing Grid Background Layer */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    zIndex: 1
                  }} />

                  {/* High-fidelity equirectangular Earth Night texture serving as control map */}
                  <img
                    src="https://unpkg.com/three-globe/example/img/earth-night.jpg"
                    alt="World radar map"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                      opacity: 0.75,
                      filter: 'hue-rotate(180deg) brightness(2.2) contrast(1.3)',
                      zIndex: 2,
                      position: 'absolute'
                    }}
                  />

                  {/* SVG Overlay containing active satellite positions and orbits */}
                  <svg
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 3,
                      overflow: 'visible'
                    }}
                  >
                    {/* Orbit Path Layer */}
                    {paths.map((p, index) => (
                      <motion.path
                        key={index}
                        d={p.d}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ filter: 'drop-shadow(0 0 3px var(--color-accent))' }}
                      />
                    ))}

                    {/* Satellite Active Indicator (Pulse Rings) */}
                    <g transform={`translate(${currentPosPercent.x * (100 / 100)}%, ${currentPosPercent.y * (100 / 100)}%)`} style={{ transformBox: 'fill-box' }}>
                      {/* Pulse circle 1 */}
                      <circle
                        r="18"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="1"
                        style={{
                          transformOrigin: 'center',
                          animation: 'pulse-radar 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite'
                        }}
                      />
                      {/* Pulse circle 2 */}
                      <circle
                        r="10"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="1.5"
                        style={{
                          transformOrigin: 'center',
                          animation: 'pulse-radar 2s cubic-bezier(0.215, 0.610, 0.355, 1) 0.6s infinite'
                        }}
                      />
                      {/* Solid Center Dot */}
                      <circle
                        r="4"
                        fill="#00ffd5"
                        style={{ filter: 'drop-shadow(0 0 6px #00ffd5)' }}
                      />
                    </g>
                  </svg>
                  
                  {/* Floating Coordinates Indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(5, 7, 18, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-secondary)',
                    zIndex: 4
                  }}>
                    Lat: <span style={{ color: 'var(--color-accent)' }}>{currentPos.lat.toFixed(4)}°</span> | Lon: <span style={{ color: 'var(--color-accent)' }}>{currentPos.lon.toFixed(4)}°</span>
                  </div>
                </div>
              </GlassCard>

              {/* Filtering & Registry grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  {/* Category Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value)}
                        style={{
                          background: activeCategory === cat.value ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.01)',
                          border: activeCategory === cat.value ? '1px solid var(--color-accent)' : '1px solid var(--border-color)',
                          color: activeCategory === cat.value ? 'var(--text-primary)' : 'var(--text-muted)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search input */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search satellites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '8px 12px 8px 34px',
                        color: 'white',
                        fontSize: '0.85rem',
                        outline: 'none',
                        width: '220px',
                        transition: 'all var(--transition-fast)'
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    />
                  </div>
                </div>

                {/* Satellites Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }} className="grid-responsive">
                  {filteredSats.map(sat => {
                    const isActive = sat.id === selectedSatId;
                    const live = liveCoords[sat.id];
                    const satPos = live ? { lat: live.lat, lon: live.lon } : getSatellitePosition(sat.id, timeMs);
                    return (
                      <GlassCard
                        key={sat.id}
                        hoverScale={true}
                        onClick={() => setSelectedSatId(sat.id)}
                        style={{
                          cursor: 'pointer',
                          borderColor: isActive ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.04)',
                          background: isActive ? 'rgba(56, 189, 248, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          padding: '20px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '5px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                              {sat.category}
                            </span>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '6px 0 0 0' }}>{sat.name}</h4>
                          </div>
                          {isActive && (
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 6px var(--color-accent)', marginTop: '4px' }} />
                          )}
                        </div>

                        {/* Quick Telemetry Indicators */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                          <div>
                            <span>Latitude:</span>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{satPos.lat.toFixed(2)}°</p>
                          </div>
                          <div>
                            <span>Longitude:</span>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{satPos.lon.toFixed(2)}°</p>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Telemetry Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Telemetry Profile */}
              <GlassCard hoverScale={false} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Radio size={16} style={{ color: 'var(--color-accent)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Telemetry</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{selectedSat.name}</h3>
                </div>

                {/* Grid stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Velocity</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(speedVal).toLocaleString()} km/h</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Altitude</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {altitudeVal >= 1000000 
                        ? `${(altitudeVal / 1000000).toFixed(2)}M km` 
                        : `${Math.round(altitudeVal).toLocaleString()} km`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inclination</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedSat.inclination}°</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passing Over</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-highlight)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={currentCountry}>
                      {currentCountry}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Asset Biography</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>{selectedSat.description}</p>
                </div>

                {/* Details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Launch Date:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSat.launchDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Operational Orbit Period:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {selectedSat.period >= 1440 
                        ? `${(selectedSat.period / 1440).toFixed(1)} Days`
                        : `${selectedSat.period} Minutes`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Status:</span>
                    <span style={{ color: '#00ff87', fontWeight: 600 }}>{selectedSat.status}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Upcoming Passes Table */}
              <GlassCard hoverScale={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Orbit size={16} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Calculated Upcoming Passes</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '8px 12px 8px 0' }}>Date</th>
                        <th style={{ padding: '8px 12px' }}>Time (Local)</th>
                        <th style={{ padding: '8px 12px' }}>Duration</th>
                        <th style={{ padding: '8px 0 8px 12px', textAlign: 'right' }}>Max Elevation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passes.map((pass, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
                          <td style={{ padding: '10px 12px 10px 0', fontWeight: 600 }}>{pass.date}</td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{pass.time}</td>
                          <td style={{ padding: '10px 12px' }}>{pass.duration}</td>
                          <td style={{ padding: '10px 0 10px 12px', textAlign: 'right', color: 'var(--color-accent)', fontWeight: 600 }}>{pass.elevation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
            
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Animations and Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-radar {
          0% {
            transform: scale(0.2);
            opacity: 1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        .radar-ping {
          animation: radar-ping-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes radar-ping-glow {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 2px var(--color-accent));
          }
          50% {
            opacity: .6;
            filter: none;
          }
        }
        @media (min-width: 992px) {
          .sat-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}} />
    </div>
  );
};
export default Satellites;
