import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchBar } from '../components/SearchBar';
import { CategoryCard } from '../components/CategoryCard';
import { Compass, User, Rocket, Landmark, Milestone, Sparkles, Star } from 'lucide-react';
import type { EntityCategory } from '../types';
import { useNasaApod } from '../hooks/useNasaApod';
import { GlassCard } from '../components/GlassCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: apod, isLoading: isApodLoading } = useNasaApod();

  // Category listing configs
  const categories = [
    {
      name: 'Planets & Moons',
      category: 'planet' as EntityCategory,
      icon: <Compass size={24} />,
      count: 8,
      description: 'Journey through the rocky spheres, gas giants, and frozen moons of our solar system.',
    },
    {
      name: 'Astronauts',
      category: 'astronaut' as EntityCategory,
      icon: <User size={24} />,
      count: 5,
      description: 'Explore profiles of brave human travelers who crossed the boundary of outer space.',
    },
    {
      name: 'Rockets',
      category: 'rocket' as EntityCategory,
      icon: <Rocket size={24} />,
      count: 5,
      description: 'Discover the propulsion launch vehicles and super-heavy starships that break gravity.',
    },
    {
      name: 'Missions',
      category: 'mission' as EntityCategory,
      icon: <Milestone size={24} />,
      count: 4,
      description: 'Analyze legendary voyages of scientific exploration, space telescopes, and orbitals.',
    },
    {
      name: 'Space Agencies',
      category: 'agency' as EntityCategory,
      icon: <Landmark size={24} />,
      count: 4,
      description: 'Inspect governmental and private corporations funding cosmic travel programs.',
    },
    {
      name: 'Space News',
      category: 'news' as EntityCategory,
      icon: <Sparkles size={24} />,
      count: 4,
      description: 'Read recent columns, research findings, and technical headlines across the cosmos.',
    },
  ];

  // Trending items mapping
  const trendingSearches = [
    { name: 'Mars', path: '/explore/planet/mars' },
    { name: 'Earth', path: '/explore/planet/earth' },
    { name: 'Moon', path: '/explore/moon/moon' },
    { name: 'Apollo 11', path: '/explore/mission/apollo-11' },
    { name: 'ISS', path: '/explore/mission/iss' },
    { name: 'James Webb Telescope', path: '/explore/mission/james-webb' },
  ];

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '80px',
      }}
    >
      {/* Hero Search Section */}
      <motion.div
        variants={itemVariants}
        style={{
          textAlign: 'center',
          padding: '40px 0 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Glow Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: 'var(--color-accent)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.05)',
          }}
        >
          <Sparkles size={14} />
          <span>Gateway to the Cosmos</span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: 'calc(2.5rem + 1.5vw)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          Explore the{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #ffffff 40%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Universe
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'calc(1rem + 0.2vw)',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: '1.5',
          }}
        >
          Search planets, astronauts, rockets, missions and more from one place.
        </p>

        {/* Centered Search Bar */}
        <div style={{ width: '100%', marginTop: '12px' }}>
          <SearchBar variant="hero" />
        </div>

        {/* Trending Searches Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
            maxWidth: '700px',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={12} />
            Trending:
          </span>
          {trendingSearches.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '6px 14px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--color-accent)';
                el.style.color = 'var(--text-primary)';
                el.style.backgroundColor = 'rgba(var(--color-accent-rgb), 0.05)';
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--border-color)';
                el.style.color = 'var(--text-secondary)';
                el.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* NASA APOD Section */}
      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>NASA Astronomy Picture of the Day</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Featuring a different space photograph or flight capture daily.
          </p>
        </div>

        {isApodLoading ? (
          <div style={{
            height: '280px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LoadingSkeleton variant="card" />
          </div>
        ) : apod && (
          <GlassCard style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '24px',
            padding: '24px',
            overflow: 'hidden'
          }} className="grid-responsive">
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              height: '320px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative'
            }}>
              {apod.mediaType === 'video' ? (
                <iframe
                  src={apod.url}
                  title={apod.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <img
                  src={apod.url}
                  alt={apod.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {apod.date}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                  {apod.title}
                </h3>
              </div>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                margin: 0,
                maxHeight: '160px',
                overflowY: 'auto',
                paddingRight: '6px'
              }}>
                {apod.explanation}
              </p>
              {apod.hdurl && (
                <a
                  href={apod.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-accent-rgb), 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  View High-Res Version
                </a>
              )}
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Categories Grid Section */}
      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Explore by Category</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Select a specialized space repository to begin catalog deep-dives.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.category}
              name={cat.name}
              category={cat.category}
              icon={cat.icon}
              count={cat.count}
              description={cat.description}
              delay={index * 0.05}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Home;
