import React from 'react';
import { Link } from 'react-router-dom';
import { Orbit, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'rgba(3, 7, 18, 0.4)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-color)',
        padding: '48px 24px 24px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '40px',
        }}
      >
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Orbit size={20} style={{ color: 'var(--color-accent)' }} />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Space Explorer
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Discover and explore planets, Moons, astronauts, rockets, and space missions from an unified dashboard experience.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Explore</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li>
              <Link to="/explore?category=planet" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Planets</Link>
            </li>
            <li>
              <Link to="/explore?category=astronaut" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Astronauts</Link>
            </li>
            <li>
              <Link to="/explore?category=rocket" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Rockets</Link>
            </li>
            <li>
              <Link to="/explore?category=mission" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Missions</Link>
            </li>
          </ul>
        </div>

        {/* Agencies Column */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Agencies</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li>
              <Link to="/explore/agency/nasa" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>NASA (US)</Link>
            </li>
            <li>
              <Link to="/explore/agency/esa" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>ESA (Europe)</Link>
            </li>
            <li>
              <Link to="/explore/agency/spacex" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>SpaceX (Private)</Link>
            </li>
            <li>
              <Link to="/explore/agency/isro" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>ISRO (India)</Link>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Portal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <li>
              <Link to="/news" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Space News</Link>
            </li>
            <li>
              <Link to="/favorites" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>Favorites</Link>
            </li>
            <li>
              <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>About System</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          © {currentYear} Space Explorer. Developed with{' '}
          <Heart size={10} style={{ color: '#ef4444', display: 'inline' }} /> for space lovers.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.35 3.12.9.01.64.01 1.11.01 1.28 0 .21-.15.46-.55.38A8.012 8.012 0 0 1 0 8c0-4.42 3.58-8 8-8z"/>
            </svg>
            <span>GitHub Profile Style</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
