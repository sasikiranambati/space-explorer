import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Rocket, User, ChevronRight,
  Heart, CheckCircle2, AlertCircle, Gauge, Compass
} from 'lucide-react';
import type { Mission } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSpaceEntity } from '../hooks/useSpaceEntity';
import { useNasaImages } from '../hooks/useNasaImages';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { GlassCard } from '../components/GlassCard';

// Pre-defined related missions map for navigation links
const RELATED_MISSIONS: Record<string, { id: string; name: string }[]> = {
  'apollo-11': [{ id: 'apollo-13', name: 'Apollo 13' }, { id: 'iss', name: 'ISS' }],
  'apollo-13': [{ id: 'apollo-11', name: 'Apollo 11' }, { id: 'voyager-1', name: 'Voyager 1' }],
  'voyager-1': [{ id: 'james-webb', name: 'James Webb Telescope' }, { id: 'perseverance', name: 'Perseverance Rover' }],
  'perseverance': [{ id: 'voyager-1', name: 'Voyager 1' }, { id: 'artemis', name: 'Artemis Program' }],
  'artemis': [{ id: 'perseverance', name: 'Perseverance Rover' }, { id: 'iss', name: 'ISS' }],
  'iss': [{ id: 'artemis', name: 'Artemis Program' }, { id: 'james-webb', name: 'James Webb Telescope' }],
  'james-webb': [{ id: 'iss', name: 'ISS' }, { id: 'voyager-1', name: 'Voyager 1' }]
};

export const MissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const missionId = id?.toLowerCase() || '';

  // 1. Fetch live mission details
  const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useSpaceEntity('mission', missionId);
  const mission = entity as Mission | undefined;

  // 2. Fetch live NASA images
  const { data: galleryImages, isLoading: isGalleryLoading } = useNasaImages(mission?.name || '');

  // 3. Tab State
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');

  // 4. Gallery Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (isEntityLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <LoadingSkeleton variant="details" />
      </div>
    );
  }

  if (isEntityError || !mission) {
    return (
      <ErrorState
        icon="error"
        title="Mission Telemetry Lost"
        description={`We could not recover data files for orbital flight pathway "${id}".`}
        onReset={() => navigate('/explore?category=mission')}
        resetLabel="Back to Missions Directory"
      />
    );
  }

  const favorited = isFavorite(mission.category, mission.id);

  // Status badge coloring helper
  const getStatusStyle = (status: Mission['status']) => {
    switch (status) {
      case 'Success':
        return { color: '#00ff87', bg: 'rgba(0, 255, 135, 0.1)', border: 'rgba(0, 255, 135, 0.2)' };
      case 'Failure':
        return { color: '#ff5c5c', bg: 'rgba(255, 92, 92, 0.1)', border: 'rgba(255, 92, 92, 0.2)' };
      case 'Ongoing':
        return { color: '#00d9ff', bg: 'rgba(0, 217, 255, 0.1)', border: 'rgba(0, 217, 255, 0.2)' };
      case 'Upcoming':
        return { color: '#bd5cff', bg: 'rgba(189, 92, 255, 0.1)', border: 'rgba(189, 92, 255, 0.2)' };
      default:
        return { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.2)' };
    }
  };

  const statusStyle = getStatusStyle(mission.status);
  const relatedList = RELATED_MISSIONS[missionId] || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Breadcrumb navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/explore?category=mission" style={{ color: 'inherit', textDecoration: 'none' }}>Missions</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-secondary)' }}>{mission.name}</span>
      </div>

      {/* 2. Hero Section */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          height: '380px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), var(--shadow-glow)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Banner image */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <img
            src={mission.image}
            alt={mission.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, rgba(10, 15, 30, 0.95) 40%, rgba(10, 15, 30, 0.3) 100%)',
            }}
          />
        </div>

        {/* Hero Title details */}
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
            {/* Mission Patch */}
            {mission.patchUrl ? (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={mission.patchUrl}
                  alt={`${mission.name} Official Patch`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.2), rgba(0,0,0,0.4))',
                  border: '2px solid var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5), var(--shadow-glow)',
                }}
              >
                {mission.name.charAt(0)}
              </div>
            )}

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
                  {mission.status}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {mission.agency}
                </span>
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                {mission.name}
              </h1>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(mission)}
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

      {/* 3. Stats Grid (4 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <GlassCard style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Calendar size={14} style={{ color: 'var(--color-accent)' }} /> Launch Date
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{mission.launchDate}</div>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Clock size={14} style={{ color: 'var(--color-accent)' }} /> Mission Duration
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{mission.duration}</div>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Rocket size={14} style={{ color: 'var(--color-accent)' }} /> Launch Vehicle
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{mission.launchVehicle}</div>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            <User size={14} style={{ color: 'var(--color-accent)' }} /> Crew Manifest
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {mission.crew.length > 0 ? (
              <span>{mission.crew[0].includes('Uncrewed') ? 'Uncrewed' : `${mission.crew.length} Astronauts`}</span>
            ) : (
              'Uncrewed'
            )}
          </div>
        </GlassCard>
      </div>

      {/* 4. Overview & Objectives */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="grid-responsive">
        
        {/* Left Column - Overview & Objectives list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GlassCard style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px' }}>Mission Overview</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', margin: 0 }}>
              {mission.description}
            </p>
          </GlassCard>

          {mission.objectives && (
            <GlassCard style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px' }}>Flight Objectives</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mission.objectives.map((obj, i) => {
                  const isCompleted = mission.status === 'Success' || (mission.status === 'Ongoing' && i < 2);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      {isCompleted ? (
                        <CheckCircle2 size={18} style={{ color: '#00ff87', marginTop: '2px', flexShrink: 0 }} />
                      ) : mission.status === 'Failure' ? (
                        <AlertCircle size={18} style={{ color: '#ff5c5c', marginTop: '2px', flexShrink: 0 }} />
                      ) : (
                        <Clock size={18} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: '0.95rem', color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {obj}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {/* Animated vertical timeline */}
          <GlassCard style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '24px' }}>Mission Milestones</h3>
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              
              {/* Timeline bar */}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {mission.milestones.map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    style={{ position: 'relative' }}
                  >
                    {/* Ring dot node */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-29px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'var(--bg-deep)',
                        border: '3px solid var(--color-accent)',
                        boxShadow: '0 0 10px var(--color-accent)',
                      }}
                    />

                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {milestone.date}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
                        {milestone.title}
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </GlassCard>
        </div>

        {/* Right Column - Telemetry Stats, Crew manifest, Related missions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Mission Statistics dials */}
          {mission.stats && (
            <GlassCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gauge size={16} style={{ color: 'var(--color-accent)' }} /> Flight Telemetry
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(mission.stats).map(([label, val], i) => (
                  <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700 }}>{val}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Crew Manifest card */}
          {mission.crew.length > 0 && !mission.crew[0].includes('Uncrewed') && (
            <GlassCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--color-accent)' }} /> Mission Crew
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mission.crew.map((member, i) => {
                  const parenIdx = member.indexOf('(');
                  const name = parenIdx !== -1 ? member.substring(0, parenIdx).trim() : member;
                  const role = parenIdx !== -1 ? member.substring(parenIdx + 1, member.length - 1) : 'Astronaut';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--color-accent)',
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {/* Related successor/predecessor missions */}
          {relatedList.length > 0 && (
            <GlassCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={16} style={{ color: 'var(--color-accent)' }} /> Related Missions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relatedList.map((rel, i) => (
                  <Link
                    key={i}
                    to={`/explore/mission/${rel.id}`}
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
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{rel.name}</span>
                      <ChevronRight size={16} style={{ color: 'var(--color-accent)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          )}

        </div>
      </div>

      {/* 5. Media Tabs Container (NASA Image Library & Videos) */}
      <GlassCard style={{ padding: '30px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', gap: '16px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveMediaTab('photos')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeMediaTab === 'photos' ? 'var(--color-accent)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: `2px solid ${activeMediaTab === 'photos' ? 'var(--color-accent)' : 'transparent'}`,
              transition: 'all var(--transition-fast)',
            }}
          >
            NASA Image Archive
          </button>
          {mission.videoUrl && (
            <button
              onClick={() => setActiveMediaTab('video')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeMediaTab === 'video' ? 'var(--color-accent)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: `2px solid ${activeMediaTab === 'video' ? 'var(--color-accent)' : 'transparent'}`,
                transition: 'all var(--transition-fast)',
              }}
            >
              Mission Video Stream
            </button>
          )}
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMediaTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeMediaTab === 'photos' && (
                <div>
                  {isGalleryLoading ? (
                    <LoadingSkeleton variant="grid" count={4} />
                  ) : !galleryImages || galleryImages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No media items found for this mission.
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
                            alt={`${mission.name} photography`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeMediaTab === 'video' && mission.videoUrl && (
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%', // 16:9 Aspect Ratio
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  }}
                >
                  <iframe
                    src={mission.videoUrl}
                    title={`${mission.name} stream`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </GlassCard>

      {/* 6. Lightbox Overlay Image Viewer */}
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
                alt="NASA photography record"
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
export default MissionDetails;
