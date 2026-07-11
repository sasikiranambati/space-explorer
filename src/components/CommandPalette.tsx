import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, User, Rocket, Landmark, Milestone, Sparkles, X, Clock } from 'lucide-react';
import { allEntities } from '../services/mockData';
import type { SpaceEntity } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpaceEntity[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 1. Listen for global toggle key (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Controlled by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 2. Load recent searches on mount/open
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('space-explorer:search-history');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          setRecentSearches([]);
        }
      }
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 3. Perform filter search matching
  useEffect(() => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      setResults([]);
      return;
    }

    const filtered = allEntities.filter(
      entity =>
        entity.name.toLowerCase().includes(cleanQuery) ||
        entity.description.toLowerCase().includes(cleanQuery) ||
        entity.category.toLowerCase().includes(cleanQuery)
    ).slice(0, 8); // Limit to 8 results for premium density

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  // 4. Keyboard controls handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const max = results.length > 0 ? results.length : recentSearches.length;
      if (max > 0) {
        setSelectedIndex(prev => (prev + 1) % max);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const max = results.length > 0 ? results.length : recentSearches.length;
      if (max > 0) {
        setSelectedIndex(prev => (prev - 1 + max) % max);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        navigateToEntity(results[selectedIndex]);
      } else if (recentSearches.length > 0 && selectedIndex < recentSearches.length) {
        // Run search with the recent item
        setQuery(recentSearches[selectedIndex]);
      }
    }
  };

  // 5. Navigate & save history
  const navigateToEntity = (entity: SpaceEntity) => {
    // Save to history
    saveSearchToHistory(entity.name);
    
    // Route path calculation
    let path = `/explore/${entity.category}/${entity.id}`;
    if (entity.category === 'planet') path = `/explore/planet/${entity.id}`;
    else if (entity.category === 'mission') path = `/explore/mission/${entity.id}`;
    else if (entity.category === 'astronaut') path = `/explore/astronaut/${entity.id}`;
    else if (entity.category === 'rocket') path = `/explore/rocket/${entity.id}`;
    
    navigate(path);
    onClose();
  };

  const saveSearchToHistory = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;
    
    const updated = [cleanTerm, ...recentSearches.filter(t => t !== cleanTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('space-explorer:search-history', JSON.stringify(updated));
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('space-explorer:search-history');
  };

  // 6. Category Icons Helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'planet':
        return <Compass size={16} />;
      case 'moon':
        return <Compass size={16} style={{ opacity: 0.6 }} />;
      case 'astronaut':
        return <User size={16} />;
      case 'rocket':
        return <Rocket size={16} />;
      case 'mission':
        return <Milestone size={16} />;
      case 'agency':
        return <Landmark size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 5, 12, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '10vh',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
          onClick={onClose}
        >
          {/* Main Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '640px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 30px 100px rgba(0,0,0,0.8), var(--shadow-glow)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 1. Header input field */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '12px',
              }}
            >
              <Search size={20} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search planets, astronauts, missions, rockets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flexGrow: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.05rem',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '6px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* 2. List results container */}
            <div
              ref={listRef}
              style={{
                maxHeight: '380px',
                overflowY: 'auto',
                padding: '12px',
              }}
            >
              {/* Filter matches */}
              {results.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cosmic Registry Results
                  </div>
                  {results.map((entity, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={entity.id}
                        onClick={() => navigateToEntity(entity)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: isSelected ? 'rgba(var(--color-accent-rgb), 0.1)' : 'transparent',
                          border: `1px solid ${isSelected ? 'rgba(var(--color-accent-rgb), 0.2)' : 'transparent'}`,
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ color: isSelected ? 'var(--color-accent)' : 'var(--text-muted)' }}>
                            {getCategoryIcon(entity.category)}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{entity.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{entity.category}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>↵ Select</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recent searches history list */}
              {query.trim() === '' && recentSearches.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Recent Searches
                    </span>
                    <button
                      onClick={clearHistory}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Clear All
                    </button>
                  </div>
                  {recentSearches.map((term, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={term}
                        onClick={() => setQuery(term)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background var(--transition-fast)',
                        }}
                      >
                        <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{term}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No results empty state */}
              {query.trim() !== '' && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <HelpCircle size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px', opacity: 0.5 }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No planetary matches found</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Check typing or expand catalog categories.</div>
                </div>
              )}

              {/* Search instructions state */}
              {query.trim() === '' && recentSearches.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                  <Sparkles size={28} style={{ color: 'var(--color-accent)', marginBottom: '8px', opacity: 0.7 }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Global Cosmic Search Ready</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Type keywords to inspect solar bodies, command crews, or launches.</div>
                </div>
              )}
            </div>

            {/* 3. Footer instructions bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 20px',
                background: 'rgba(10, 15, 30, 0.4)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', gap: '14px' }}>
                <span><kbd style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>↑↓</kbd> Navigate</span>
                <span><kbd style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Enter</kbd> Select</span>
              </div>
              <div>
                <span><kbd style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Esc</kbd> Dismiss</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
// Small local placeholder so HelpCircle compiles inside empty states
const HelpCircle: React.FC<{ size: number; style: React.CSSProperties }> = ({ size, style }) => (
  <Compass size={size} style={style} />
);
