import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Moon, Heart, Clock, Activity,
  ChevronRight, Orbit, Info, Calendar, Landmark
} from 'lucide-react';
import type { Moon as MoonType, Mission } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSpaceEntity } from '../hooks/useSpaceEntity';
import { useNasaImages } from '../hooks/useNasaImages';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { PlanetViewer } from '../components/PlanetViewer';
import { missions as mockMissions, moons as mockMoons } from '../services/mockData';

export const MoonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'characteristics' | 'history' | 'missions' | 'gallery'>('overview');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const moonId = id?.toLowerCase() || '';

  // 1. Fetch live moon details
  const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useSpaceEntity('moon', moonId);
  const moon = entity as MoonType | undefined;

  // 2. Fetch live photos from NASA Image API
  const { data: galleryImages, isLoading: isGalleryLoading } = useNasaImages(moon?.name ? `${moon.name} moon space` : '');

  if (isEntityLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <LoadingSkeleton variant="details" />
      </div>
    );
  }

  if (isEntityError || !moon) {
    return (
      <ErrorState
        icon="error"
        title="Moon Profile Offline"
        description={`We could not load specifications for lunar body "${id}".`}
        onReset={() => navigate('/explore')}
        resetLabel="Back to Space Registry"
      />
    );
  }

  const favorited = isFavorite(moon.category, moon.id);
  const has3D = moon.id === 'moon'; // Only Earth's moon has 3D assets mapped in configurations

  // 3. Find related missions
  const relatedMissions = mockMissions.filter(m =>
    m.name.toLowerCase().includes(moon.name.toLowerCase()) ||
    m.description.toLowerCase().includes(moon.name.toLowerCase()) ||
    m.objective.toLowerCase().includes(moon.name.toLowerCase()) ||
    (m.objectives && m.objectives.some(obj => obj.toLowerCase().includes(moon.name.toLowerCase())))
  );

  // 4. Find sister moons (other moons of same planet)
  const sisterMoons = mockMoons.filter(m => m.planet === moon.planet && m.id !== moon.id);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Breadcrumb path */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to={`/explore/planet/${moon.planet}`} style={{ color: 'inherit', textDecoration: 'none', textTransform: 'capitalize' }}>{moon.planet}</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-secondary)' }}>{moon.name}</span>
      </div>

      {/* Hero Header Card */}
      <GlassCard hoverScale={false} style={{ padding: 0, borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }} className="hero-layout">
          {/* Left Hero Image */}
          <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={moon.image}
              alt={moon.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(10,15,30,0.95))' }} />
          </div>

          {/* Right Hero Specs */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                  <Moon size={14} /> Natural Satellite
                </span>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {has3D && (
                    <button
                      onClick={() => setIsViewerOpen(true)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: 'var(--color-accent)',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all var(--transition-fast)'
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
                      <Orbit size={12} />
                      <span>View in 3D</span>
                    </button>
                  )}
                  <button
                    onClick={() => toggleFavorite(moon)}
                    style={{
                      background: favorited ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: favorited ? '1px solid #ef4444' : '1px solid var(--border-color)',
                      borderRadius: '50%',
                      padding: '8px',
                      cursor: 'pointer',
                      color: favorited ? '#ef4444' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Heart size={16} fill={favorited ? '#ef4444' : 'none'} />
                  </button>
                </div>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '6px 0 0 0' }}>{moon.name}</h1>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-highlight)', margin: '4px 0' }}>
                "{moon.funFact}"
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: '8px 0 0 0' }}>
                {moon.description}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '24px', overflowX: 'auto', paddingBottom: '2px' }}>
        {(['overview', 'characteristics', 'history', 'missions', 'gallery'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
              padding: '8px 4px',
              fontSize: '0.95rem',
              fontWeight: activeTab === tab ? 700 : 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }} className="grid-responsive">
              <GlassCard hoverScale={false}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={18} style={{ color: 'var(--color-accent)' }} /> Orbital Characteristics
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {moon.name} orbits its parent gas giant or planet in a locked configuration. It maintains a stable gravity coefficient of <strong>{moon.gravity}</strong>, with a full revolutions index complete every <strong>{moon.orbitalPeriod}</strong>.
                </p>
              </GlassCard>

              <GlassCard hoverScale={false}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Landmark size={18} style={{ color: 'var(--color-accent)' }} /> Parent Connectivity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    This satellite resides within the gravitational influence system of planet <span style={{ textTransform: 'capitalize' }}>{moon.planet}</span>.
                  </p>
                  <Link
                    to={`/explore/planet/${moon.planet}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      marginTop: '8px',
                      transition: 'border-color var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <span style={{ textTransform: 'capitalize' }}>Explore parent planet {moon.planet}</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {activeTab === 'characteristics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <StatCard label="Radius" value={moon.radius} icon={<Compass size={18} />} delay={0.05} />
            <StatCard label="Mass" value={moon.mass} icon={<Activity size={18} />} delay={0.1} />
            <StatCard label="Gravity" value={moon.gravity} icon={<Orbit size={18} />} delay={0.15} />
            <StatCard label="Orbit Period" value={moon.orbitalPeriod} icon={<Clock size={18} />} delay={0.2} />
            <StatCard label="Temperature" value={moon.temperature} icon={<Info size={18} />} delay={0.25} />
            <StatCard label="Discovered" value={moon.discoveryYear || 'N/A'} icon={<Calendar size={18} />} delay={0.3} />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Exploration & Discovery Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {moon.explorationHistory.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }} />
                      {i < moon.explorationHistory.length - 1 && (
                        <div style={{ flex: 1, width: '2px', background: 'var(--border-color)', margin: '6px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: '12px' }}>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'missions' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Related Robotic & Crewed Missions</h3>
            {relatedMissions.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {relatedMissions.map((mission: Mission) => (
                  <Link key={mission.id} to={`/explore/mission/${mission.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <GlassCard hoverScale={true} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', background: mission.status === 'Ongoing' || mission.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: mission.status === 'Ongoing' || mission.status === 'Success' ? '#10b981' : '#ef4444' }}>
                            {mission.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mission.launchDate}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>{mission.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {mission.description}
                        </p>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent)', marginTop: '12px' }}>
                        View telemetry dossier <ChevronRight size={12} />
                      </span>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            ) : (
              <GlassCard style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active historical missions directly target {moon.name} in standard databases.
              </GlassCard>
            )}
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>NASA Observatories Media Record</h3>
            {isGalleryLoading ? (
              <LoadingSkeleton variant="grid" />
            ) : galleryImages && galleryImages.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {galleryImages.map((img: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxUrl(img.url)}
                    style={{
                      height: '180px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.05)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                      transition: 'transform var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            ) : (
              <GlassCard style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No photographic records found in NASA public image archives.
              </GlassCard>
            )}
          </motion.div>
        )}
      </div>

      {/* Sister Moons Section */}
      {sisterMoons.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Other Satellites of this Parent Planet</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }} className="grid-responsive">
            {sisterMoons.map((sister) => (
              <Link key={sister.id} to={`/explore/moon/${sister.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <GlassCard hoverScale={true} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                      <img src={sister.image} alt={sister.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{sister.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Radius: {sister.radius}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--color-accent)' }} />
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxUrl(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 5, 15, 0.95)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '40px', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={lightboxUrl} alt="NASA High-res moon record" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', display: 'block' }} />
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }} onClick={() => setLightboxUrl(null)}>✕</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @media(min-width: 768px) {
          .hero-layout {
            grid-template-columns: 1fr 2fr !important;
          }
          .hero-layout > div:first-child {
            height: 100% !important;
            min-height: 280px;
          }
        }
      `}} />

      {/* 3D Planet/Moon Viewer Modal */}
      <PlanetViewer
        planetId="moon"
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        planetName={moon.name}
        description={moon.description}
        funFact={moon.funFact}
      />
    </div>
  );
};
export default MoonDetails;
