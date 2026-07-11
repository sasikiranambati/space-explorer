import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SearchBar } from './SearchBar';
import { Moon, Sun, Menu, X, Orbit } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll to make navbar background more solid
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'News', path: '/news' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
        background: scrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all var(--transition-normal)',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-highlight))',
            padding: '6px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(var(--color-accent-rgb), 0.3)',
          }}
        >
          <Orbit size={18} style={{ color: '#000000' }} />
        </div>
        <span
          style={{
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Space Explorer
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <nav
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '24px',
        }}
        className="desktop-nav"
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              position: 'relative',
              padding: '6px 0',
              transition: 'color var(--transition-fast)',
            })}
            className={({ isActive }) => (isActive ? 'active-nav-link' : '')}
          >
            {link.name}
            {link.name === 'Favorites' && favorites.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-16px',
                  background: 'rgba(var(--color-accent-rgb), 0.15)',
                  border: '1px solid var(--color-accent)',
                  color: 'var(--color-accent)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {favorites.length}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Right Action Controls */}
      <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-controls">
        <SearchBar variant="navbar" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '8px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hover)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
          }}
          title={theme === 'deep-cosmos' ? 'Nebula Purple mode' : 'Deep Cosmos mode'}
        >
          {theme === 'deep-cosmos' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Hamburger Menu Icon (Mobile Only) */}
      <div style={{ display: 'flex', gap: '12px' }} className="mobile-only-controls">
        {/* Theme Toggle (Mobile Quick Access) */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {theme === 'deep-cosmos' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 7, 18, 0.95)',
            backdropFilter: 'blur(24px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            gap: '24px',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <SearchBar variant="hero" onCloseMobile={() => setIsOpen(false)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                })}
              >
                <span>{link.name}</span>
                {link.name === 'Favorites' && favorites.length > 0 && (
                  <span
                    style={{
                      background: 'rgba(var(--color-accent-rgb), 0.15)',
                      border: '1px solid var(--color-accent)',
                      color: 'var(--color-accent)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    {favorites.length}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Global CSS Inject to support responsiveness properly */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-controls {
            display: flex !important;
          }
          .mobile-only-controls {
            display: none !important;
          }
        }
        
        .active-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(to right, var(--color-accent), var(--color-highlight));
          box-shadow: 0 0 8px var(--color-accent);
        }
      `}} />
    </header>
  );
};
export default Navbar;
