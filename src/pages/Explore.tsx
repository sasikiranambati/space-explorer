import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpaceSearch } from '../hooks/useSpaceSearch';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { SpaceEntity, EntityCategory } from '../types';
import { GlassCard } from '../components/GlassCard';
import { ErrorState } from '../components/ErrorState';
import { SectionTitle } from '../components/SectionTitle';
import { Search, Compass, Moon, User, Rocket, Landmark, Milestone, Eye } from 'lucide-react';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse parameters from query URL
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);

  // Synchronize component states when URL parameters change
  useEffect(() => {
    setActiveCategory(urlCategory);
    setSearchQuery(urlSearch);
  }, [urlCategory, urlSearch]);

  const { data: searchResults, isLoading, isError } = useSpaceSearch(
    searchQuery,
    activeCategory === 'all' ? undefined : activeCategory
  );
  const filteredEntities = searchResults || [];

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams);
  };

  const categories = [
    { value: 'all', label: 'All Cosmos', icon: null },
    { value: 'planet', label: 'Planets', icon: <Compass size={14} /> },
    { value: 'moon', label: 'Moons', icon: <Moon size={14} /> },
    { value: 'astronaut', label: 'Astronauts', icon: <User size={14} /> },
    { value: 'rocket', label: 'Rockets', icon: <Rocket size={14} /> },
    { value: 'agency', label: 'Agencies', icon: <Landmark size={14} /> },
    { value: 'mission', label: 'Missions', icon: <Milestone size={14} /> },
  ];

  const getCategoryColor = (cat: EntityCategory) => {
    switch (cat) {
      case 'planet':
        return '#38bdf8'; // sky
      case 'moon':
        return '#818cf8'; // indigo
      case 'astronaut':
        return '#fb7185'; // rose
      case 'rocket':
        return '#fb923c'; // orange
      case 'agency':
        return '#c084fc'; // purple
      case 'mission':
        return '#34d399'; // emerald
      default:
        return '#94a3b8';
    }
  };

  const getEntityQuickStats = (entity: SpaceEntity) => {
    switch (entity.category) {
      case 'planet':
        const p = entity as any;
        return `Gravity: ${p.gravity} • Orbit: ${p.orbitalPeriod}`;
      case 'moon':
        const m = entity as any;
        return `Parent: ${m.planet} • Orbit: ${m.orbitalPeriod}`;
      case 'astronaut':
        const a = entity as any;
        return `Status: ${a.status} • Flight time: ${a.flightTime}`;
      case 'rocket':
        const r = entity as any;
        return `Cost: ${r.costPerLaunch} • Status: ${r.status}`;
      case 'agency':
        const ag = entity as any;
        return `HQ: ${ag.headquarters} • Founded: ${ag.founded}`;
      case 'mission':
        const mi = entity as any;
        return `Status: ${mi.status} • Vehicle: ${mi.launchVehicle}`;
      default:
        return '';
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
        gap: '40px',
      }}
    >
      {/* Header and Search control */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <SectionTitle
          title="Explorer Registry"
          subtitle="Query profiles, engineering specifications, and cosmic mission logs."
        />

        {/* Local page search box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '8px 16px',
            width: '100%',
            maxWidth: '360px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search registry name/details..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Category Navigation Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`category-tag ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
              }}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Grid List */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSkeleton variant="grid" count={8} />
          </motion.div>
        ) : isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorState
              icon="error"
              title="Cosmic connection lost"
              description="A network query timeout or API rate-limit was hit. Fallback registry is loading."
              onReset={() => handleSearchChange('')}
              resetLabel="Retry Query"
            />
          </motion.div>
        ) : filteredEntities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <ErrorState
              icon="search"
              title="Registry profile not found"
              description={`We couldn't find any documents matching your current criteria: category "${activeCategory}" and keyword "${searchQuery}".`}
              onReset={() => {
                handleCategoryChange('all');
                handleSearchChange('');
              }}
              resetLabel="Clear Filters"
            />
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredEntities.map((entity, i) => (
              <GlassCard
                key={`${entity.category}-${entity.id}`}
                onClick={() => navigate(`/explore/${entity.category}/${entity.id}`)}
                delay={Math.min(i * 0.04, 0.3)}
                hoverScale={true}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  height: '340px',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                }}
              >
                {/* Header Image */}
                <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden' }}>
                  <img
                    src={entity.image}
                    alt={entity.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform var(--transition-slow)',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {/* Category Pill Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.8)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${getCategoryColor(entity.category)}`,
                      color: getCategoryColor(entity.category),
                    }}
                  >
                    {entity.category}
                  </span>
                </div>

                {/* Body Details */}
                <div
                  style={{
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {entity.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {entity.description}
                    </p>
                  </div>

                  {/* Footer details row */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {getEntityQuickStats(entity)}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                      }}
                    >
                      <Eye size={12} />
                      <span>View Profile</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Explore;
