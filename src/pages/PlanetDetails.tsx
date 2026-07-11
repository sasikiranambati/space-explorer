import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Moon, Heart, Clock, Activity,
  ChevronRight, Globe, Gauge, Zap, Info, Award, Orbit
} from 'lucide-react';
import type { Planet, Moon as MoonType } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { moons as mockMoons } from '../services/mockData';
import { useSpaceEntity } from '../hooks/useSpaceEntity';
import { useNasaImages } from '../hooks/useNasaImages';
import { Search, SlidersHorizontal } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { GlassCard } from '../components/GlassCard';
import { PlanetViewer } from '../components/PlanetViewer';

// Solar System planetary order for neighbor calculations
const PLANET_ORDER = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

const PLANET_METRICS = {
  radius: {
    label: 'Equatorial Radius',
    unit: 'km',
    data: { mercury: 2439.7, venus: 6051.8, earth: 6371.0, mars: 3389.5, jupiter: 69911, saturn: 58232, uranus: 25362, neptune: 24622 }
  },
  gravity: {
    label: 'Surface Gravity',
    unit: 'm/s²',
    data: { mercury: 3.7, venus: 8.87, earth: 9.807, mars: 3.71, jupiter: 24.79, saturn: 10.44, uranus: 8.69, neptune: 11.15 }
  },
  orbit: {
    label: 'Orbital Period',
    unit: 'days',
    data: { mercury: 88, venus: 224.7, earth: 365.25, mars: 687, jupiter: 4333, saturn: 10759, uranus: 30687, neptune: 60190 }
  }
};

export const PlanetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const planetId = id?.toLowerCase() || '';

  // 1. Fetch live planet details from query layer
  const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useSpaceEntity('planet', planetId);
  const planet = entity as Planet | undefined;

  // 2. Fetch live images from NASA Search API
  const { data: galleryImages, isLoading: isGalleryLoading } = useNasaImages(planet?.name || '');

  // 3. Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'characteristics' | 'atmosphere' | 'exploration' | 'gallery'>('overview');
  
  // 4. Comparison Metric State
  const [comparisonMetric, setComparisonMetric] = useState<'radius' | 'gravity' | 'orbit'>('radius');

  // 5. Gallery Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // 6. Moons Explorer Filter States
  const [moonSearch, setMoonSearch] = useState('');
  const [moonSort, setMoonSort] = useState<'name' | 'radius' | 'period' | 'discovery'>('name');

  if (isEntityLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <LoadingSkeleton variant="details" />
      </div>
    );
  }

  if (isEntityError || !planet) {
    return (
      <ErrorState
        icon="error"
        title="Planet Profile Offline"
        description={`We could not load the telemetry profile for planetary orbit "${id}" at this time.`}
        onReset={() => navigate('/explore?category=planet')}
        resetLabel="Back to Planetary Directory"
      />
    );
  }

  const favorited = isFavorite(planet.category, planet.id);

  // 6. Find Neighboring Planets
  const planetIdx = PLANET_ORDER.indexOf(planetId);
  const relatedPlanets = [];
  if (planetIdx > 0) {
    const prevId = PLANET_ORDER[planetIdx - 1];
    relatedPlanets.push({ id: prevId, name: prevId.charAt(0).toUpperCase() + prevId.slice(1) });
  }
  if (planetIdx < PLANET_ORDER.length - 1) {
    const nextId = PLANET_ORDER[planetIdx + 1];
    relatedPlanets.push({ id: nextId, name: nextId.charAt(0).toUpperCase() + nextId.slice(1) });
  }

  // 7. Find all moons belonging to this planet
  const planetMoons = mockMoons.filter(m => m.planet === planetId);

  // Filter and sort moons
  const filteredMoons = planetMoons
    .filter(m => m.name.toLowerCase().includes(moonSearch.toLowerCase()))
    .sort((a, b) => {
      if (moonSort === 'radius') {
        const radA = parseFloat(a.radius.replace(/,/g, ''));
        const radB = parseFloat(b.radius.replace(/,/g, ''));
        return radB - radA; // Descending size
      }
      if (moonSort === 'period') {
        const perA = parseFloat(a.orbitalPeriod);
        const perB = parseFloat(b.orbitalPeriod);
        return perA - perB; // Ascending period
      }
      if (moonSort === 'discovery') {
        if (a.discoveryYear === 'Prehistoric') return -1;
        if (b.discoveryYear === 'Prehistoric') return 1;
        return parseInt(a.discoveryYear || '0') - parseInt(b.discoveryYear || '0');
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Breadcrumb navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/explore?category=planet" style={{ color: 'inherit', textDecoration: 'none' }}>Planets</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-secondary)' }}>{planet.name}</span>
      </div>

      {/* 2. Hero Section */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          height: '420px',
          display: 'flex',
          alignItems: 'flex-end',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), var(--shadow-glow)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Planet Banner Image */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <img
            src={planet.image}
            alt={planet.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Black Vignette Overlays */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(10, 15, 30, 0.95) 10%, rgba(10, 15, 30, 0.4) 60%, rgba(10, 15, 30, 0.8) 100%)',
            }}
          />
        </div>

        {/* Hero Title & Actions */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            padding: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
              }}
            >
              Planetary Profile
            </span>
            <h1
              style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {planet.name}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsViewerOpen(true)}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: 'var(--color-accent)',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.08)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
              }}
            >
              <Orbit size={18} />
              <span>View in 3D</span>
            </button>

            <button
              onClick={() => toggleFavorite(planet)}
              style={{
                background: favorited ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${favorited ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.1)'}`,
                color: favorited ? 'var(--bg-deep)' : 'var(--text-primary)',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: favorited ? 'var(--shadow-glow)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
              onMouseOver={(e) => {
                if (!favorited) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                if (!favorited) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
              <span>{favorited ? 'Bookmarked' : 'Add Bookmark'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Quick Stats Grid (8 Cards) */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Orbital & Physical Telemetry</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={14} style={{ color: 'var(--color-accent)' }} /> Radius
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{planet.radius}</div>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={14} style={{ color: 'var(--color-accent)' }} /> Surface Gravity
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{planet.gravity}</div>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} style={{ color: 'var(--color-accent)' }} /> Temperature
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{planet.temperature}</div>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} style={{ color: 'var(--color-accent)' }} /> Mass
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }} title={planet.mass}>{planet.mass}</div>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} style={{ color: 'var(--color-accent)' }} /> Atmosphere Gases
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{Object.keys(planet.atmosphere).length} Gases</div>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Moon size={14} style={{ color: 'var(--color-accent)' }} /> Satellites (Moons)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{planet.moons.length} Moons</div>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} style={{ color: 'var(--color-accent)' }} /> Orbital Period
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{planet.orbitalPeriod}</div>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} style={{ color: 'var(--color-accent)' }} /> Escape Velocity
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{planet.escapeVelocity || 'N/A'}</div>
          </GlassCard>

        </div>
      </div>

      {/* 4. Dashboard Tabs Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {(['overview', 'characteristics', 'atmosphere', 'exploration', 'gallery'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--color-accent)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '12px 20px',
                cursor: 'pointer',
                borderBottom: `2px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
                transition: 'all var(--transition-fast)',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
              }}
            >
              {tab === 'characteristics' ? 'Characteristics' : tab}
            </button>
          );
        })}
      </div>

      {/* 5. Dashboard Tab Contents */}
      <div style={{ minHeight: '300px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <GlassCard style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px' }}>Mission Summary</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', margin: 0 }}>{planet.description}</p>
                </GlassCard>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-responsive">
                  <GlassCard style={{ padding: '24px', flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={16} style={{ color: 'var(--color-accent)' }} /> Editorial Facts
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                      {planet.funFact}
                    </p>
                  </GlassCard>

                  <GlassCard style={{ padding: '24px', flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Moon size={16} style={{ color: 'var(--color-accent)' }} /> Natural Satellites
                    </h3>
                    {planet.moons.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>This body has no natural orbiting satellites.</p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {planet.moons.map((m, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.85rem',
                            }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === 'characteristics' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-2-col">
                  <GlassCard style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px' }}>Physical Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Mean Density</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{planet.density || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Surface Gravity</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{planet.gravity}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Escape Velocity</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{planet.escapeVelocity || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', paddingBottom: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Distance from Sun</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{planet.distanceFromSun}</span>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '12px' }}>Earth Relative Scale</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
                      Compare the physical footprint of {planet.name} against our home planet.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          <span>Gravity Ratio</span>
                          <span>{planetId === 'earth' ? '100%' : planetId === 'mars' ? '38%' : planetId === 'jupiter' ? '253%' : planetId === 'saturn' ? '106%' : 'N/A'}</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: planetId === 'earth' ? '100%' : planetId === 'mars' ? '38%' : planetId === 'jupiter' ? '100%' : planetId === 'saturn' ? '100%' : '10%' }}
                            transition={{ duration: 1 }}
                            style={{ height: '100%', background: 'var(--color-accent)', borderRadius: '3px' }}
                          />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          <span>Radius Ratio</span>
                          <span>{planetId === 'earth' ? '100%' : planetId === 'mars' ? '53%' : planetId === 'jupiter' ? '1097%' : planetId === 'saturn' ? '913%' : 'N/A'}</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: planetId === 'earth' ? '100%' : planetId === 'mars' ? '53%' : planetId === 'jupiter' ? '100%' : planetId === 'saturn' ? '91%' : '15%' }}
                            transition={{ duration: 1 }}
                            style={{ height: '100%', background: 'var(--color-accent)', borderRadius: '3px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === 'atmosphere' && (
              <GlassCard style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '12px' }}>Atmospheric Composition</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                  The elements that construct the surrounding atmospheric pressure layers.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {Object.entries(planet.atmosphere).map(([gas, percentage], idx) => {
                    const pctVal = parseFloat(percentage.replace('%', '')) || 5;
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{gas}</span>
                          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{percentage}</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pctVal}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            style={{ height: '100%', background: 'linear-gradient(to right, rgba(var(--color-accent-rgb), 0.5), var(--color-accent))', borderRadius: '4px' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {activeTab === 'exploration' && (
              <div style={{ position: 'relative', paddingLeft: '30px', margin: '20px 0' }}>
                {/* Vertical Axis line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    bottom: '8px',
                    left: '7px',
                    width: '2px',
                    background: 'linear-gradient(to bottom, var(--color-accent), rgba(255,255,255,0.05))',
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {planet.explorationHistory.map((historyStr, idx) => {
                    const colonIdx = historyStr.indexOf(':');
                    const year = colonIdx !== -1 ? historyStr.substring(0, colonIdx) : `Milestone ${idx + 1}`;
                    const details = colonIdx !== -1 ? historyStr.substring(colonIdx + 1).trim() : historyStr;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        style={{ position: 'relative' }}
                      >
                        {/* Bullet node */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '-29px',
                            top: '6px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'var(--bg-deep)',
                            border: '3px solid var(--color-accent)',
                            boxShadow: '0 0 10px var(--color-accent)',
                          }}
                        />

                        {/* Milestone Card */}
                        <GlassCard style={{ padding: '20px' }}>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--color-accent)',
                              display: 'block',
                              marginBottom: '6px',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {year}
                          </span>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                            {details}
                          </p>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                {isGalleryLoading ? (
                  <LoadingSkeleton variant="grid" count={4} />
                ) : !galleryImages || galleryImages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No media items retrieved from NASA archive.
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {galleryImages.map((imgUrl, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setLightboxUrl(imgUrl)}
                        style={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          height: '180px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`${planet.name} NASA record`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 6. Comparison Section */}
      <GlassCard style={{ padding: '30px', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>System Comparison</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', marginBottom: 0 }}>Compare orbital specifications across all planets.</p>
          </div>
          {/* Metric Selector Buttons */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {(['radius', 'gravity', 'orbit'] as const).map((metric) => {
              const isActive = comparisonMetric === metric;
              return (
                <button
                  key={metric}
                  onClick={() => setComparisonMetric(metric)}
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                    border: 'none',
                    color: isActive ? 'var(--color-accent)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textTransform: 'capitalize',
                  }}
                >
                  {metric}
                </button>
              );
            })}
          </div>
        </div>

        {/* System Bar Chart comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Object.entries(PLANET_METRICS[comparisonMetric].data).map(([pName, pVal]) => {
            const isActivePlanet = pName === planetId;
            const maxVal = Math.max(...Object.values(PLANET_METRICS[comparisonMetric].data));
            const widthPct = Math.max(8, (pVal / maxVal) * 100);

            return (
              <div key={pName} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '80px',
                    fontSize: '0.85rem',
                    fontWeight: isActivePlanet ? 700 : 500,
                    color: isActivePlanet ? 'var(--color-accent)' : 'var(--text-secondary)',
                    textTransform: 'capitalize',
                  }}
                >
                  {pName}
                </span>

                <div style={{ flex: 1, height: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '7px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 1 }}
                    style={{
                      height: '100%',
                      background: isActivePlanet 
                        ? 'linear-gradient(to right, var(--color-accent), #00ffd5)'
                        : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '7px',
                      boxShadow: isActivePlanet ? '0 0 10px var(--color-accent)' : 'none',
                    }}
                  />
                </div>

                <span
                  style={{
                    width: '100px',
                    fontSize: '0.85rem',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: isActivePlanet ? 'var(--color-accent)' : 'var(--text-muted)',
                  }}
                >
                  {pVal.toLocaleString()} {PLANET_METRICS[comparisonMetric].unit}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Moons Explorer Section */}
      {planetMoons.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Moon size={22} style={{ color: 'var(--color-accent)' }} /> Satellites Registry ({planetMoons.length})
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Inspect orbital moons orbiting {planet.name}’s gravitational pull.
              </p>
            </div>

            {/* Moons Search & Sort Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search moons..."
                  value={moonSearch}
                  onChange={(e) => setMoonSearch(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 12px 8px 34px',
                    color: 'white',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '180px',
                    transition: 'all var(--transition-fast)'
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                />
              </div>

              {/* Sort Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0 10px' }}>
                <SlidersHorizontal size={14} style={{ marginRight: '6px', color: 'var(--text-muted)' }} />
                <select
                  value={moonSort}
                  onChange={(e: any) => setMoonSort(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: '8px 0'
                  }}
                >
                  <option value="name" style={{ background: 'var(--bg-deep)' }}>Name (A-Z)</option>
                  <option value="radius" style={{ background: 'var(--bg-deep)' }}>Size (Largest)</option>
                  <option value="period" style={{ background: 'var(--bg-deep)' }}>Orbit (Shortest)</option>
                  <option value="discovery" style={{ background: 'var(--bg-deep)' }}>Discovery (Oldest)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Moons Grid */}
          {filteredMoons.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {filteredMoons.map((moon: MoonType) => {
                const has3D = moon.id === 'moon';

                return (
                  <Link key={moon.id} to={`/explore/moon/${moon.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <GlassCard hoverScale={true} style={{ padding: '0', overflow: 'hidden', borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      {/* Moon Card Image */}
                      <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                        <img
                          src={moon.image}
                          alt={moon.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* 3D View Badge if available */}
                        {has3D && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(56, 189, 248, 0.18)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            color: 'var(--color-accent)',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>
                            <Orbit size={10} style={{ animation: 'spin 4s linear infinite' }} /> 3D Model
                          </div>
                        )}
                      </div>

                      {/* Moon Specs Details */}
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {moon.name}
                        </h3>

                        {/* Specs grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                            <span>Radius:</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{moon.radius}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                            <span>Orbital Period:</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{moon.orbitalPeriod}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px' }}>
                            <span>Discovered:</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{moon.discoveryYear}</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          ) : (
            <GlassCard style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No moons matched the filter criteria.
            </GlassCard>
          )}
        </div>
      )}

      {/* 7. Neighbor Navigation Links */}
      {relatedPlanets.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Neighboring Orbits</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2-col">
            {relatedPlanets.map((rel, i) => (
              <Link
                key={i}
                to={`/explore/planet/${rel.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <GlassCard
                  hoverScale
                  style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {i === 0 && planetIdx > 0 ? 'Inner Neighbor' : 'Outer Neighbor'}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{rel.name}</span>
                  </div>
                  <ChevronRight size={24} style={{ color: 'var(--color-accent)' }} />
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 8. Lightbox Overlay Image Viewer */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxUrl(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(5, 5, 15, 0.92)',
              backdropFilter: 'blur(16px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                position: 'relative',
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 30px 100px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <img
                src={lightboxUrl}
                alt="NASA high-res planetary record"
                style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(10, 15, 30, 0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onClick={() => setLightboxUrl(null)}
              >
                ✕
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
          .grid-2-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

      {/* 3D Planet Viewer Immersive modal */}
      <PlanetViewer
        planetId={planet.id}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        planetName={planet.name}
        description={planet.description}
        funFact={planet.funFact}
      />

    </div>
  );
};
export default PlanetDetails;
