import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, User, ChevronRight, Heart, Image, Info, Award,
  Globe, Briefcase, Medal, GraduationCap, Activity
} from 'lucide-react';
import type { Astronaut } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSpaceEntity } from '../hooks/useSpaceEntity';
import { useNasaImages } from '../hooks/useNasaImages';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { GlassCard } from '../components/GlassCard';
import { astronauts as mockAstronauts } from '../services/mockData';

export const AstronautDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const astronautId = id?.toLowerCase() || '';

  // 1. Fetch live astronaut details
  const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useSpaceEntity('astronaut', astronautId);
  const astronaut = entity as Astronaut | undefined;

  // 2. Fetch live photos from NASA Image API
  const { data: galleryImages, isLoading: isGalleryLoading } = useNasaImages(astronaut?.name || '');

  // 3. Gallery Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (isEntityLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <LoadingSkeleton variant="details" />
      </div>
    );
  }

  if (isEntityError || !astronaut) {
    return (
      <ErrorState
        icon="error"
        title="Astronaut File Offline"
        description={`We could not load the astronaut personnel dossier for "${id}" at this time.`}
        onReset={() => navigate('/explore?category=astronaut')}
        resetLabel="Back to Astronaut Directory"
      />
    );
  }

  const favorited = isFavorite(astronaut.category, astronaut.id);

  // Status badge style helper
  const getStatusStyle = (status: Astronaut['status']) => {
    switch (status) {
      case 'Active':
        return { color: '#00ff87', bg: 'rgba(0, 255, 135, 0.1)', border: 'rgba(0, 255, 135, 0.2)' };
      case 'Retired':
        return { color: '#00d9ff', bg: 'rgba(0, 217, 255, 0.1)', border: 'rgba(0, 217, 255, 0.2)' };
      case 'Deceased':
        return { color: '#ff5c5c', bg: 'rgba(255, 92, 92, 0.1)', border: 'rgba(255, 92, 92, 0.2)' };
      default:
        return { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.2)' };
    }
  };

  const statusStyle = getStatusStyle(astronaut.status);

  // Dynamic Crew Colleague Recommendation (colleagues overlapping in missions flown)
  const colleagues = mockAstronauts
    .filter(
      other =>
        other.id !== astronaut.id &&
        other.missions.some(m => astronaut.missions.some(am => am.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(am.toLowerCase())))
    )
    .slice(0, 3);

  // Map mission names to matching page paths
  const getMissionRoute = (missionName: string) => {
    const normName = missionName.toLowerCase();
    if (normName.includes('apollo 11')) return '/explore/mission/apollo-11';
    if (normName.includes('apollo 13')) return '/explore/mission/apollo-13';
    if (normName.includes('voyager 1')) return '/explore/mission/voyager-1';
    if (normName.includes('perseverance') || normName.includes('mars 2020')) return '/explore/mission/perseverance';
    if (normName.includes('artemis')) return '/explore/mission/artemis';
    if (normName.includes('iss') || normName.includes('international space station')) return '/explore/mission/iss';
    if (normName.includes('webb') || normName.includes('jwst')) return '/explore/mission/james-webb';
    return `/explore?search=${encodeURIComponent(missionName)}`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Breadcrumb navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/explore?category=astronaut" style={{ color: 'inherit', textDecoration: 'none' }}>Astronauts</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-secondary)' }}>{astronaut.name}</span>
      </div>

      {/* 2. Hero Section */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '260px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), var(--shadow-glow)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Landscape Banner Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
            alt="Space banner backdrop"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, rgba(10, 15, 30, 0.96) 50%, rgba(10, 15, 30, 0.4) 100%)',
            }}
          />
        </div>

        {/* Hero details layout */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            padding: '30px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Astronaut Avatar Portrait */}
            <div
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6), var(--shadow-glow)',
                flexShrink: 0,
              }}
            >
              <img
                src={astronaut.image}
                alt={astronaut.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
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
                  {astronaut.status}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {astronaut.agency.toUpperCase()} Space Cadet
                </span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                {astronaut.name}
              </h1>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(astronaut)}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        <GlassCard style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={14} style={{ color: 'var(--color-accent)' }} /> Missions Flown
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {astronaut.missions.length} Launches
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} style={{ color: 'var(--color-accent)' }} /> Cumulative Space Time
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {astronaut.flightTime}
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={14} style={{ color: 'var(--color-accent)' }} /> Spacewalks (EVAs)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {astronaut.spacewalks} Walks
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} style={{ color: 'var(--color-accent)' }} /> EVA Duration
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {astronaut.spacewalkTime}
          </div>
        </GlassCard>

      </div>

      {/* 4. Biography & Personal Dossier Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="grid-responsive">
        
        {/* Left Column - Biography & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <GlassCard style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px' }}>Biographical Record</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', marginBottom: '20px' }}>
              {astronaut.biography}
            </p>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--color-accent)', borderRadius: '0 8px 8px 0' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Dossier Brief: </span>
              {astronaut.description}
            </div>
          </GlassCard>

          {/* Career Timelines */}
          {astronaut.careerTimeline && (
            <GlassCard style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '24px' }}>Career Milestones</h3>
              <div style={{ position: 'relative', paddingLeft: '30px' }}>
                
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {astronaut.careerTimeline.map((milestone, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      style={{ position: 'relative' }}
                    >
                      {/* Node bullet */}
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
                          {milestone.year}
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
          )}

          {/* NASA Image Gallery */}
          <GlassCard style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image size={18} style={{ color: 'var(--color-accent)' }} /> Spaceflight Photography
            </h3>
            {isGalleryLoading ? (
              <LoadingSkeleton variant="grid" count={4} />
            ) : !galleryImages || galleryImages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No active photographs found in the NASA archive for this personnel record.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
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
                      alt={`${astronaut.name} mission record`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

        </div>

        {/* Right Column - Personnel Dossier, Achievements, Crew Colleagues, Missions Flown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Personnel Dossier card */}
          <GlassCard style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} style={{ color: 'var(--color-accent)' }} /> Personnel Dossier
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Nationality</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{astronaut.nationality}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Birth Date</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{astronaut.birthDate}</span>
              </div>
              {astronaut.deathDate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Deceased Date</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{astronaut.deathDate}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agency Command</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>{astronaut.agency}</span>
              </div>
            </div>
          </GlassCard>

          {/* Achievements & Decorated Awards */}
          <GlassCard style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Medal size={16} style={{ color: 'var(--color-accent)' }} /> Achievements & Awards
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {astronaut.achievements.map((ach, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Award size={14} style={{ color: 'var(--color-accent)', marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{ach}</span>
                </div>
              ))}
              {astronaut.awards && astronaut.awards.map((aw, i) => (
                <div key={`aw-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Award size={14} style={{ color: '#00d9ff', marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{aw}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Flown Missions Index */}
          <GlassCard style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={16} style={{ color: 'var(--color-accent)' }} /> Flight Missions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {astronaut.missions.map((missionName, i) => (
                <Link
                  key={i}
                  to={getMissionRoute(missionName)}
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
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{missionName}</span>
                    <ChevronRight size={16} style={{ color: 'var(--color-accent)' }} />
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Related Crewmates Colleagues */}
          {colleagues.length > 0 && (
            <GlassCard style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--color-accent)' }} /> Crew Colleague Co-workers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {colleagues.map((col, i) => (
                  <Link
                    key={i}
                    to={`/explore/astronaut/${col.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={col.image}
                          alt={col.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{col.name}</span>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
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
                alt="NASA high-res astronaut photography"
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
export default AstronautDetails;
