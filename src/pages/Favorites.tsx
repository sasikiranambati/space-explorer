import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../contexts/FavoritesContext';
import { GlassCard } from '../components/GlassCard';
import { ErrorState } from '../components/ErrorState';
import { SectionTitle } from '../components/SectionTitle';
import { Heart, Compass, Moon, User, Rocket, Landmark, Milestone, Eye } from 'lucide-react';
import type { EntityCategory } from '../types';

export const Favorites: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const getCategoryColor = (cat: EntityCategory) => {
    switch (cat) {
      case 'planet':
        return '#38bdf8';
      case 'moon':
        return '#818cf8';
      case 'astronaut':
        return '#fb7185';
      case 'rocket':
        return '#fb923c';
      case 'agency':
        return '#c084fc';
      case 'mission':
        return '#34d399';
      default:
        return '#94a3b8';
    }
  };

  const getCategoryIcon = (cat: EntityCategory) => {
    switch (cat) {
      case 'planet':
        return <Compass size={12} />;
      case 'moon':
        return <Moon size={12} />;
      case 'astronaut':
        return <User size={12} />;
      case 'rocket':
        return <Rocket size={12} />;
      case 'agency':
        return <Landmark size={12} />;
      case 'mission':
        return <Milestone size={12} />;
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
        gap: '40px',
      }}
    >
      <SectionTitle
        title="Bookmarks Registry"
        subtitle="Saved space profiles, astronaut cards, and engineering structures."
      />

      <AnimatePresence mode="popLayout">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <ErrorState
              icon="empty"
              title="Bookmarks empty"
              description="No cosmic profiles have been bookmarked yet. While reading any profile, click the heart button to bookmark it here."
              onReset={() => navigate('/explore')}
              resetLabel="Browse Registry"
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
            {favorites.map((entity, i) => (
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
                {/* Header Image with unfavorite button overlay */}
                <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden' }}>
                  <img
                    src={entity.image}
                    alt={entity.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Category Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${getCategoryColor(entity.category)}`,
                      color: getCategoryColor(entity.category),
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {getCategoryIcon(entity.category)}
                    {entity.category}
                  </span>

                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(entity);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      borderRadius: '50%',
                      padding: '6px',
                      cursor: 'pointer',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)',
                    }}
                    title="Remove from favorites"
                  >
                    <Heart size={14} fill="#ef4444" />
                  </button>
                </div>

                {/* Body Details */}
                <div
                  style={{
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                      marginTop: '12px',
                    }}
                  >
                    <span
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
                      View Profile
                    </span>
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
export default Favorites;
