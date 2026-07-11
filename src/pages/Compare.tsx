import React, { useState } from 'react';
import { Compass, Scale, Thermometer, Orbit, Gauge, ArrowRightLeft } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { planets as mockPlanets } from '../services/mockData';

export const Compare: React.FC = () => {
  // 1. Dropdown states
  const [planetAId, setPlanetAId] = useState<string>('earth');
  const [planetBId, setPlanetBId] = useState<string>('mars');

  // Find planets from mock database
  const planetA = mockPlanets.find(p => p.id === planetAId) || mockPlanets[0];
  const planetB = mockPlanets.find(p => p.id === planetBId) || mockPlanets[1];

  // Helper parser values
  const parseVal = (str: string | undefined): number => {
    if (!str) return 0;
    // Strips units like km, m/s^2, kg, g/cm^3, etc.
    const clean = str.replace(/[^\d.-]/g, '');
    return parseFloat(clean) || 0;
  };

  // Helper percentage ratios
  const getRatio = (valA: number, valB: number): { ratioA: number; ratioB: number } => {
    const total = valA + valB;
    if (total === 0) return { ratioA: 50, ratioB: 50 };
    return {
      ratioA: Math.round((valA / total) * 100),
      ratioB: Math.round((valB / total) * 100)
    };
  };

  // Compare specs calculations
  const radiusA = parseVal(planetA.radius);
  const radiusB = parseVal(planetB.radius);
  const radRatios = getRatio(radiusA, radiusB);

  const gravityA = parseVal(planetA.gravity);
  const gravityB = parseVal(planetB.gravity);
  const gravRatios = getRatio(gravityA, gravityB);

  const tempA = parseVal(planetA.temperature);
  const tempB = parseVal(planetB.temperature);
  // Temperature can be negative; we offset for ratio mapping
  const cleanTempA = Math.max(tempA + 273.15, 0); // Convert to Kelvin
  const cleanTempB = Math.max(tempB + 273.15, 0);
  const tempRatios = getRatio(cleanTempA, cleanTempB);

  const escapeA = parseVal(planetA.escapeVelocity);
  const escapeB = parseVal(planetB.escapeVelocity);
  const escRatios = getRatio(escapeA, escapeB);

  const densityA = parseVal(planetA.density);
  const densityB = parseVal(planetB.density);
  const denRatios = getRatio(densityA, densityB);

  const moonsA = planetA.moons ? planetA.moons.length : 0;
  const moonsB = planetB.moons ? planetB.moons.length : 0;
  const moonRatios = getRatio(moonsA, moonsB);

  // Generate scientific summary text
  const getSummary = () => {
    const findings: string[] = [];
    if (radiusA !== radiusB) {
      findings.push(`${radiusA > radiusB ? planetA.name : planetB.name} is larger in size with a radius of ${radiusA > radiusB ? planetA.radius : planetB.radius}`);
    }
    if (gravityA !== gravityB) {
      findings.push(`${gravityA > gravityB ? planetA.name : planetB.name} has stronger surface gravity (${gravityA > gravityB ? planetA.gravity : planetB.gravity})`);
    }
    if (tempA !== tempB) {
      findings.push(`${tempA > tempB ? planetA.name : planetB.name} is warmer on average at ${tempA > tempB ? planetA.temperature : planetB.temperature}`);
    }
    if (moonsA !== moonsB) {
      findings.push(`${moonsA > moonsB ? planetA.name : planetB.name} hosts a larger moon configuration (${moonsA > moonsB ? moonsA : moonsB} satellites)`);
    }
    return findings.length > 0
      ? `Analysis confirms: ${findings.join(', and ')}.`
      : 'Both celestial bodies share identical physical dimension indices.';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Page Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
          <ArrowRightLeft size={12} /> Planetary Analytics
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Planet Comparison Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px', margin: 0 }}>
          Conduct side-by-side gravitational, atmospheric, and volumetric diagnostics of celestial bodies.
        </p>
      </div>

      {/* 2. Selectors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-responsive">
        
        {/* Planet A selector */}
        <GlassCard style={{ padding: '24px' }}>
          <div style={{ color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Celestial Body A</div>
          <select
            value={planetAId}
            onChange={(e) => setPlanetAId(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(10, 15, 30, 0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {mockPlanets.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === planetBId}>
                {p.name}
              </option>
            ))}
          </select>
        </GlassCard>

        {/* Planet B selector */}
        <GlassCard style={{ padding: '24px' }}>
          <div style={{ color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Celestial Body B</div>
          <select
            value={planetBId}
            onChange={(e) => setPlanetBId(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(10, 15, 30, 0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {mockPlanets.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === planetAId}>
                {p.name}
              </option>
            ))}
          </select>
        </GlassCard>

      </div>

      {/* 3. Planets Overview Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-responsive">
        
        {/* Planet A stats */}
        <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={planetA.image}
              alt={planetA.name}
              style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.05)' }}
            />
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{planetA.name}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Planet</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            {planetA.description}
          </p>
        </GlassCard>

        {/* Planet B stats */}
        <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={planetB.image}
              alt={planetB.name}
              style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.05)' }}
            />
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{planetB.name}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Planet</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            {planetB.description}
          </p>
        </GlassCard>

      </div>

      {/* 4. Comparative Metrics Bar Dashboard */}
      <GlassCard style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '8px' }}>Metric Diagnostics</h3>

        {/* Metric Bar Row: Radius */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Compass size={14} /> Radius</span>
            <span style={{ color: 'var(--text-muted)' }}>{planetA.radius} vs {planetB.radius}</span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', display: 'flex' }}>
            <div style={{ width: `${radRatios.ratioA}%`, background: 'linear-gradient(to right, #00d9ff, #0077ff)', transition: 'width 0.4s ease' }} />
            <div style={{ width: `${radRatios.ratioB}%`, background: 'linear-gradient(to right, #ff7b00, #ff5c5c)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Metric Bar Row: Gravity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Scale size={14} /> Surface Gravity</span>
            <span style={{ color: 'var(--text-muted)' }}>{planetA.gravity} vs {planetB.gravity}</span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', display: 'flex' }}>
            <div style={{ width: `${gravRatios.ratioA}%`, background: 'linear-gradient(to right, #00d9ff, #0077ff)', transition: 'width 0.4s ease' }} />
            <div style={{ width: `${gravRatios.ratioB}%`, background: 'linear-gradient(to right, #ff7b00, #ff5c5c)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Metric Bar Row: Temperature */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Thermometer size={14} /> Avg Temperature</span>
            <span style={{ color: 'var(--text-muted)' }}>{planetA.temperature} vs {planetB.temperature}</span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', display: 'flex' }}>
            <div style={{ width: `${tempRatios.ratioA}%`, background: 'linear-gradient(to right, #00d9ff, #0077ff)', transition: 'width 0.4s ease' }} />
            <div style={{ width: `${tempRatios.ratioB}%`, background: 'linear-gradient(to right, #ff7b00, #ff5c5c)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Metric Bar Row: Density */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Gauge size={14} /> Density</span>
            <span style={{ color: 'var(--text-muted)' }}>{planetA.density || 'N/A'} vs {planetB.density || 'N/A'}</span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', display: 'flex' }}>
            <div style={{ width: `${denRatios.ratioA}%`, background: 'linear-gradient(to right, #00d9ff, #0077ff)', transition: 'width 0.4s ease' }} />
            <div style={{ width: `${denRatios.ratioB}%`, background: 'linear-gradient(to right, #ff7b00, #ff5c5c)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Metric Bar Row: Escape Velocity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Gauge size={14} /> Escape Velocity</span>
            <span style={{ color: 'var(--text-muted)' }}>{planetA.escapeVelocity || 'N/A'} vs {planetB.escapeVelocity || 'N/A'}</span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', display: 'flex' }}>
            <div style={{ width: `${escRatios.ratioA}%`, background: 'linear-gradient(to right, #00d9ff, #0077ff)', transition: 'width 0.4s ease' }} />
            <div style={{ width: `${escRatios.ratioB}%`, background: 'linear-gradient(to right, #ff7b00, #ff5c5c)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Metric Bar Row: Moons count */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Orbit size={14} /> Moon Count</span>
            <span style={{ color: 'var(--text-muted)' }}>{moonsA} satellites vs {moonsB} satellites</span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', display: 'flex' }}>
            <div style={{ width: `${moonRatios.ratioA}%`, background: 'linear-gradient(to right, #00d9ff, #0077ff)', transition: 'width 0.4s ease' }} />
            <div style={{ width: `${moonRatios.ratioB}%`, background: 'linear-gradient(to right, #ff7b00, #ff5c5c)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

      </GlassCard>

      {/* 5. Summary Text Panel */}
      <GlassCard style={{ padding: '24px', background: 'rgba(var(--color-accent-rgb), 0.03)', border: '1px solid rgba(var(--color-accent-rgb), 0.15)' }}>
        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Astrophysical Analysis Summary</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
          {getSummary()}
        </p>
      </GlassCard>

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
export default Compare;
