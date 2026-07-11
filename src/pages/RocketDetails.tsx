import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Rocket, ChevronRight, Heart, Image,
  Gauge, Compass, Settings
} from 'lucide-react';
import type { Rocket as RocketType } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSpaceEntity } from '../hooks/useSpaceEntity';
import { useNasaImages } from '../hooks/useNasaImages';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { GlassCard } from '../components/GlassCard';
import { rockets as mockRockets } from '../services/mockData';

export const RocketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const rocketId = id?.toLowerCase() || '';

  // 1. Fetch live rocket details
  const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useSpaceEntity('rocket', rocketId);
  const rocket = entity as RocketType | undefined;

  // 2. Fetch live photos from NASA Image API
  const { data: galleryImages, isLoading: isGalleryLoading } = useNasaImages(rocket?.name ? `${rocket.name} launch rocket` : '');

  // 3. Gallery Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (isEntityLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <LoadingSkeleton variant="details" />
      </div>
    );
  }

  if (isEntityError || !rocket) {
    return (
      <ErrorState
        icon="error"
        title="Telemetry Offline"
        description={`We could not load specifications for launch vehicle "${id}".`}
        onReset={() => navigate('/explore?category=rocket')}
        resetLabel="Back to Rockets Directory"
      />
    );
  }

  const favorited = isFavorite(rocket.category, rocket.id);

  // Status badge styling helper
  const getStatusStyle = (status: RocketType['status']) => {
    switch (status) {
      case 'Active':
        return { color: '#00ff87', bg: 'rgba(0, 255, 135, 0.1)', border: 'rgba(0, 255, 135, 0.2)' };
      case 'Retired':
        return { color: '#ff5c5c', bg: 'rgba(255, 92, 92, 0.1)', border: 'rgba(255, 92, 92, 0.2)' };
      case 'In Development':
        return { color: '#bd5cff', bg: 'rgba(189, 92, 255, 0.1)', border: 'rgba(189, 92, 255, 0.2)' };
      default:
        return { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.2)' };
    }
  };

  const statusStyle = getStatusStyle(rocket.status);

  // Filter out the current rocket to get related rockets
  const relatedRockets = mockRockets.filter(r => r.id !== rocket.id).slice(0, 3);

  // Calculate success rates dial circumference values
  const successPercentage = parseFloat(rocket.successRate) || 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (successPercentage / 100) * circumference;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/explore?category=rocket" style={{ color: 'inherit', textDecoration: 'none' }}>Rockets</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-secondary)' }}>{rocket.name}</span>
      </div>

      {/* 2. Hero Section */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), var(--shadow-glow)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <img
            src={rocket.image}
            alt={rocket.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, rgba(10, 15, 30, 0.95) 45%, rgba(10, 15, 30, 0.3) 100%)',
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.15), rgba(0,0,0,0.4))',
                border: '2px solid var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5), var(--shadow-glow)',
                color: 'var(--color-accent)',
                flexShrink: 0,
              }}
            >
              <Rocket size={48} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: statusStyle.bg,
                    border: `1px solid ${statusStyle.border}`,
                    color: statusStyle.color,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {rocket.status}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {rocket.manufacturer}
                </span>
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                {rocket.name}
              </h1>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(rocket)}
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
          >
            <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
            <span>{favorited ? 'Bookmarked' : 'Add Bookmark'}</span>
          </button>
        </div>
      </div>

      {/* 3. Specs Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Specifications List Card */}
        <GlassCard style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} style={{ color: 'var(--color-accent)' }} /> Vehicle Specifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Height</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{rocket.height}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Diameter</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{rocket.diameter}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Launch Mass</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{rocket.mass}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Booster Stages</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{rocket.stages} stages</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payload capacity (LEO)</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{rocket.payloadLeo}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payload capacity (GTO)</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{rocket.payloadGto}</span>
            </div>
          </div>
        </GlassCard>

        {/* Propulsion specs & cost per launch */}
        <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} style={{ color: 'var(--color-accent)' }} /> Propulsion Telemetry
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {rocket.engines && (
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Engines Array</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>{rocket.engines}</div>
                </div>
              )}
              {rocket.fuel && (
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Liquid Propellants / Fuel</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>{rocket.fuel}</div>
                </div>
              )}
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Cost Per Flight Launch</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)' }}>{rocket.costPerLaunch}</div>
              </div>
            </div>
          </div>

          <div style={{ flexGrow: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Propulsion Details:</span>
            {rocket.propulsion}
          </div>

        </GlassCard>

        {/* Launch stats success rate gauge */}
        <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          
          <div style={{ alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge size={18} style={{ color: 'var(--color-accent)' }} /> Launch Diagnostics
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flight success rates and histories</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Visual Circular Gauge */}
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-accent)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px var(--color-accent))' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {rocket.successRate}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Success
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Launches</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{rocket.launches} liftoffs</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Maiden Voyage</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{rocket.firstLaunch}</div>
              </div>
            </div>
          </div>

        </GlassCard>

      </div>

      {/* 4. Description & Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="grid-responsive">
        
        {/* Main Column - Description & NASA image search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <GlassCard style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px' }}>Vehicle Overview</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', margin: 0 }}>
              {rocket.description}
            </p>
          </GlassCard>

          {/* NASA Image Gallery */}
          <GlassCard style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image size={18} style={{ color: 'var(--color-accent)' }} /> Launcher Photography Archive
            </h3>
            
            {isGalleryLoading ? (
              <LoadingSkeleton variant="grid" count={4} />
            ) : !galleryImages || galleryImages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No flight images available in NASA logs for this vehicle.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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
                      borderRadius: '12px',
                      overflow: 'hidden',
                      height: '140px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${rocket.name} flight log`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

        </div>

        {/* Side Column - Developmental Timeline & Related rockets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Timeline Milestones */}
          {rocket.timeline && (
            <GlassCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--color-accent)' }} /> Developmental Milestones
              </h3>
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                
                {/* Vertical Axis line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    bottom: '6px',
                    left: '5px',
                    width: '2px',
                    background: 'linear-gradient(to bottom, var(--color-accent), rgba(255,255,255,0.05))',
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {rocket.timeline.map((milestone, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      {/* Node circle */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-23px',
                          top: '5px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--bg-deep)',
                          border: '2px solid var(--color-accent)',
                        }}
                      />
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                          {milestone.date}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0' }}>
                          {milestone.title}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </GlassCard>
          )}

          {/* Related Rockets carousels */}
          {relatedRockets.length > 0 && (
            <GlassCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={16} style={{ color: 'var(--color-accent)' }} /> Related Launchers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relatedRockets.map((rel, i) => (
                  <Link
                    key={i}
                    to={`/explore/rocket/${rel.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{rel.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rel.manufacturer}</div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--color-accent)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          )}

        </div>
      </div>

      {/* 5. Lightbox Overlay Image Viewer */}
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
                alt="NASA high-res launch photography"
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
        }
      `}} />

    </div>
  );
};
export default RocketDetails;
