import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEntityById } from '../services/mockData';
import type { EntityCategory } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { ErrorState } from '../components/ErrorState';
import {
  Compass, Moon, User, Rocket, Landmark, Milestone,
  Heart, Calendar, Award, BookOpen, Clock, Activity, FileText, ChevronRight
} from 'lucide-react';

export const Details: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const entity = getEntityById(category as EntityCategory, id || '');

  if (!entity) {
    return (
      <ErrorState
        icon="error"
        title="Entity Not Found"
        description={`We could not locate a profile matching category "${category}" and ID "${id}" in the space registry.`}
        onReset={() => navigate('/explore')}
        resetLabel="Return to Registry"
      />
    );
  }

  const favorited = isFavorite(entity.category, entity.id);

  // Render stats based on category
  const renderStats = () => {
    switch (entity.category) {
      case 'planet': {
        const p = entity as any;
        return (
          <>
            <StatCard label="Mass" value={p.mass} icon={<Activity size={18} />} delay={0.05} />
            <StatCard label="Radius" value={p.radius} icon={<Compass size={18} />} delay={0.1} />
            <StatCard label="Gravity" value={p.gravity} icon={<Landmark size={18} />} delay={0.15} />
            <StatCard label="Orbital Period" value={p.orbitalPeriod} icon={<Clock size={18} />} delay={0.2} />
          </>
        );
      }
      case 'moon': {
        const m = entity as any;
        return (
          <>
            <StatCard label="Mass" value={m.mass} icon={<Activity size={18} />} delay={0.05} />
            <StatCard label="Radius" value={m.radius} icon={<Compass size={18} />} delay={0.1} />
            <StatCard label="Gravity" value={m.gravity} icon={<Landmark size={18} />} delay={0.15} />
            <StatCard label="Orbit Period" value={m.orbitalPeriod} icon={<Clock size={18} />} delay={0.2} />
          </>
        );
      }
      case 'astronaut': {
        const a = entity as any;
        return (
          <>
            <StatCard label="Status" value={a.status} icon={<Activity size={18} />} delay={0.05} />
            <StatCard label="Flight Time" value={a.flightTime} icon={<Clock size={18} />} delay={0.1} />
            <StatCard label="EVAs (Spacewalks)" value={a.spacewalks} icon={<Award size={18} />} delay={0.15} />
            <StatCard label="Spacewalk Hours" value={a.spacewalkTime} icon={<Calendar size={18} />} delay={0.2} />
          </>
        );
      }
      case 'rocket': {
        const r = entity as any;
        return (
          <>
            <StatCard label="Manufacturer" value={r.manufacturer} icon={<Landmark size={18} />} delay={0.05} />
            <StatCard label="Height / Diameter" value={`${r.height} / ${r.diameter}`} icon={<Compass size={18} />} delay={0.1} />
            <StatCard label="LEO Payload" value={r.payloadLeo} icon={<Rocket size={18} />} delay={0.15} />
            <StatCard label="Launch Price" value={r.costPerLaunch} icon={<Activity size={18} />} delay={0.2} />
          </>
        );
      }
      case 'agency': {
        const ag = entity as any;
        return (
          <>
            <StatCard label="Abbreviation" value={ag.abbreviation} icon={<FileText size={18} />} delay={0.05} />
            <StatCard label="Headquarters" value={ag.headquarters} icon={<Compass size={18} />} delay={0.1} />
            <StatCard label="Founded" value={ag.founded} icon={<Calendar size={18} />} delay={0.15} />
            <StatCard label="Annual Budget" value={ag.budget} icon={<Activity size={18} />} delay={0.2} />
          </>
        );
      }
      case 'mission': {
        const mi = entity as any;
        return (
          <>
            <StatCard label="Status" value={mi.status} icon={<Activity size={18} />} delay={0.05} />
            <StatCard label="Launch Date" value={mi.launchDate} icon={<Calendar size={18} />} delay={0.1} />
            <StatCard label="Launch Vehicle" value={mi.launchVehicle} icon={<Rocket size={18} />} delay={0.15} />
            <StatCard label="Duration" value={mi.duration} icon={<Clock size={18} />} delay={0.2} />
          </>
        );
      }
      default:
        return null;
    }
  };

  // Render main descriptive columns
  const renderDetailSections = () => {
    switch (entity.category) {
      case 'planet': {
        const p = entity as any;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--color-accent)' }} />
                Atmospheric Composition
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(p.atmosphere).map(([gas, pct]) => {
                  const pctStr = pct as string;
                  return (
                    <div key={gas}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{gas}</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{pctStr}</span>
                      </div>
                      {/* Visual Progress Bar */}
                      <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.05)' }}>
                        <div
                          style={{
                            height: '100%',
                            borderRadius: '3px',
                            background: 'linear-gradient(to right, var(--color-accent), var(--color-highlight))',
                            width: pctStr.includes('%') ? pctStr : '10%',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Exploration History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {p.explorationHistory.map((item: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent)' }} />
                      {i < p.explorationHistory.length - 1 && (
                        <div style={{ flex: 1, width: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: '12px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        );
      }

      case 'moon': {
        const m = entity as any;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Exploration History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {m.explorationHistory.map((item: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                      {i < m.explorationHistory.length - 1 && (
                        <div style={{ flex: 1, width: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: '12px' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        );
      }

      case 'astronaut': {
        const a = entity as any;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--color-accent)' }} />
                Biography
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{a.biography}</p>
            </GlassCard>

            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--color-accent)' }} />
                Key Achievements
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {a.achievements.map((item: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <ChevronRight size={16} style={{ color: 'var(--color-accent)', marginTop: '2px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        );
      }

      case 'rocket': {
        const r = entity as any;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: 'var(--color-accent)' }} />
                Propulsion System
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{r.propulsion}</p>
            </GlassCard>

            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Mission Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>First Flight:</span>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{r.firstLaunch}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Total Launches:</span>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{r.launches}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Success Rate:</span>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{r.successRate}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Stages:</span>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{r.stages}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      }

      case 'agency': {
        const ag = entity as any;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--color-accent)' }} />
                History & Founding
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{ag.history}</p>
            </GlassCard>

            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--color-accent)' }} />
                Notable Milestones
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ag.notableAchievements.map((item: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <ChevronRight size={16} style={{ color: 'var(--color-accent)', marginTop: '2px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        );
      }

      case 'mission': {
        const mi = entity as any;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Mission Timeline & Milestones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mi.milestones.map((ms: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent)' }} />
                      {i < mi.milestones.length - 1 && (
                        <div style={{ flex: 1, width: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)' }}>{ms.date}</span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 4px' }}>{ms.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{ms.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard hoverScale={false}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--color-accent)' }} />
                Scientific Results
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mi.scienceResults.map((item: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <ChevronRight size={16} style={{ color: 'var(--color-accent)', marginTop: '2px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const getCategoryIcon = (cat: EntityCategory) => {
    switch (cat) {
      case 'planet':
        return <Compass size={16} />;
      case 'moon':
        return <Moon size={16} />;
      case 'astronaut':
        return <User size={16} />;
      case 'rocket':
        return <Rocket size={16} />;
      case 'agency':
        return <Landmark size={16} />;
      case 'mission':
        return <Milestone size={16} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Return button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 0',
            transition: 'color var(--transition-fast)',
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ← Return to previous
        </button>
      </div>

      {/* Main Bio / Banner glass card */}
      <GlassCard hoverScale={false} animateDirection="up" style={{ padding: 0, borderRadius: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }} className="details-banner">
          {/* Banner Left Image */}
          <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={entity.image}
              alt={entity.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Dark overlay gradient */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
              }}
            />
          </div>

          {/* Banner Right Bio */}
          <div
            style={{
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                  }}
                >
                  {getCategoryIcon(entity.category)}
                  {entity.category}
                </span>

                {/* Favorite Bookmark Switch Button */}
                <button
                  onClick={() => toggleFavorite(entity)}
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
                  title={favorited ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  <Heart size={16} fill={favorited ? '#ef4444' : 'none'} />
                </button>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '4px' }}>{entity.name}</h1>
              {entity.category === 'planet' && (entity as any).funFact && (
                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--color-highlight)', margin: '4px 0' }}>
                  "{ (entity as any).funFact }"
                </p>
              )}
              {entity.category === 'moon' && (entity as any).funFact && (
                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--color-highlight)', margin: '4px 0' }}>
                  "{ (entity as any).funFact }"
                </p>
              )}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {entity.description}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Grid containing tailored numeric stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {renderStats()}
      </div>

      {/* Detail grids for timeline, biography, and components */}
      <div className="detail-grid">
        {/* Primary timeline column */}
        {renderDetailSections()}

        {/* Sidebar related connections column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GlassCard hoverScale={false}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>System Connectivity</h3>
            
            {entity.category === 'planet' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Moons Orbiting</span>
                {(entity as any).moons && (entity as any).moons.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(entity as any).moons.map((moonName: string) => {
                      const moonId = moonName.toLowerCase();
                      return (
                        <Link
                          key={moonName}
                          to={`/explore/moon/${moonId}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            background: 'rgba(255, 255, 255, 0.01)',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'all var(--transition-fast)',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }}
                        >
                          <span>{moonName}</span>
                          <ChevronRight size={14} />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No satellites mapped.</div>
                )}
              </div>
            )}

            {entity.category === 'moon' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Parent Planet</span>
                <Link
                  to={`/explore/planet/${(entity as any).planet}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255,255,255,0.01)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{(entity as any).planet}</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}

            {entity.category === 'astronaut' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Affiliated Agency</span>
                  <Link
                    to={`/explore/agency/${(entity as any).agency}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    <span>{(entity as any).agency}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Missions Flown</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(entity as any).missions.map((mission: string) => {
                      const missionId = mission.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link
                          key={mission}
                          to={`/explore/mission/${missionId}`}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.02)',
                            background: 'rgba(255, 255, 255, 0.01)',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            display: 'block',
                          }}
                        >
                          {mission}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {entity.category === 'mission' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Lead Agency</span>
                  <Link
                    to={`/explore/agency/${(entity as any).agency}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    <span style={{ textTransform: 'uppercase' }}>{(entity as any).agency}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Crew Members</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(entity as any).crew.map((member: string) => {
                      const astId = member.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link
                          key={member}
                          to={`/explore/astronaut/${astId}`}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.02)',
                            background: 'rgba(255, 255, 255, 0.01)',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            display: 'block',
                          }}
                        >
                          {member}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {entity.category === 'agency' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Programs</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(entity as any).activeMissions.map((mission: string) => {
                    const missionId = mission.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link
                        key={mission}
                        to={`/explore/mission/${missionId}`}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.02)',
                          background: 'rgba(255, 255, 255, 0.01)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          display: 'block',
                        }}
                      >
                        {mission}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {entity.category === 'rocket' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Engines are fueled and calibrated. Profile displays complete manufacturing specifications.
              </div>
            )}
          </GlassCard>

          <GlassCard hoverScale={false}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Security Rating</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span>Public Access Cleared</span>
            </div>
          </GlassCard>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .details-banner {
            grid-template-columns: 1fr 2fr !important;
          }
          .details-banner > div:first-child {
            height: 100% !important;
            min-height: 280px;
          }
        }
      `}} />
    </div>
  );
};
export default Details;
