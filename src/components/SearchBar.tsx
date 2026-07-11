import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, User, Rocket, Landmark, Milestone, Sparkles, X, Clock, Moon } from 'lucide-react';
import { searchEntities } from '../services/mockData';
import type { SpaceEntity, EntityCategory } from '../types';

interface SearchBarProps {
  variant?: 'hero' | 'navbar';
  onCloseMobile?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'hero',
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SpaceEntity[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('space-explorer-recent-searches');
      return saved ? JSON.parse(saved) : ['Mars', 'Apollo 11', 'ISS'];
    } catch {
      return ['Mars', 'Apollo 11', 'ISS'];
    }
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('space-explorer-recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Global Ctrl+K / '/' hotkey to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault();
          inputRef.current?.focus();
          setIsFocused(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update search results on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    const filtered = searchEntities(query);
    setResults(filtered);
    setActiveIndex(-1);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectEntity = (entity: SpaceEntity) => {
    // Add to recent searches
    addRecentSearch(entity.name);
    setIsFocused(false);
    setQuery('');
    navigate(`/explore/${entity.category}/${entity.id}`);
    if (onCloseMobile) onCloseMobile();
  };

  const addRecentSearch = (term: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 5);
    });
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(t => t !== term));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelectEntity(results[activeIndex]);
      } else if (query.trim()) {
        addRecentSearch(query);
        setIsFocused(false);
        navigate(`/explore?search=${encodeURIComponent(query)}`);
        setQuery('');
        if (onCloseMobile) onCloseMobile();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const getCategoryIcon = (category: EntityCategory) => {
    switch (category) {
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
        return <Sparkles size={16} />;
    }
  };

  // Group results by category
  const groupedResults = results.reduce((acc, entity) => {
    if (!acc[entity.category]) {
      acc[entity.category] = [];
    }
    acc[entity.category].push(entity);
    return acc;
  }, {} as Record<EntityCategory, SpaceEntity[]>);

  // Category display names
  const categoryNames: Record<EntityCategory, string> = {
    planet: 'Planets',
    moon: 'Moons',
    astronaut: 'Astronauts',
    rocket: 'Rockets',
    agency: 'Space Agencies',
    mission: 'Space Missions',
    news: 'News',
  };

  // Flatten grouped results to map indexes for keyboard navigation
  const flatResultsList: SpaceEntity[] = [];
  const groupBoundaries: { category: string; startIndex: number; count: number }[] = [];
  
  Object.entries(groupedResults).forEach(([cat, val]) => {
    const list = val as SpaceEntity[];
    groupBoundaries.push({
      category: cat,
      startIndex: flatResultsList.length,
      count: list.length,
    });
    flatResultsList.push(...list);
  });

  const isHero = variant === 'hero';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: isHero ? '680px' : isFocused ? '320px' : '200px',
        margin: isHero ? '0 auto' : '0',
        transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
      }}
    >
      {/* Search Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: isHero ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.03)',
          border: isFocused ? '1px solid var(--color-accent)' : '1px solid var(--border-color)',
          borderRadius: isHero ? '18px' : '12px',
          padding: isHero ? '14px 20px' : '8px 14px',
          boxShadow: isFocused ? '0 0 20px rgba(var(--color-accent-rgb), 0.15)' : 'none',
          backdropFilter: 'blur(16px)',
          transition: 'all var(--transition-fast)',
        }}
      >
        <Search size={isHero ? 20 : 16} style={{ color: isFocused ? 'var(--color-accent)' : 'var(--text-muted)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={isHero ? "Search planets, astronauts, missions, rockets..." : "Quick search... (Ctrl+K)"}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: isHero ? '1.05rem' : '0.9rem',
            width: '100%',
            fontFamily: 'var(--font-body)',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        )}
        {!query && !isHero && (
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            /
          </div>
        )}
      </div>

      {/* Autocomplete Suggestion Dropdown */}
      {isFocused && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'rgba(10, 15, 30, 0.85)',
            border: '1px solid var(--border-hover)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), var(--shadow-glow)',
            backdropFilter: 'blur(24px)',
            padding: '16px',
            maxHeight: '450px',
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          {/* Recent Searches (Show when input query is empty) */}
          {!query.trim() && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px',
                }}
              >
                <Clock size={12} />
                <span>Recent Searches</span>
              </div>
              {recentSearches.length === 0 ? (
                <div style={{ padding: '8px 4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No recent searches
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {recentSearches.map((term, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setQuery(term);
                        addRecentSearch(term);
                        setIsFocused(false);
                        navigate(`/explore?search=${encodeURIComponent(term)}`);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>{term}</span>
                      <button
                        onClick={(e) => removeRecentSearch(e, term)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Results grouped by Category */}
          {query.trim() && results.length === 0 && (
            <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No matches found for "{query}"
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {groupBoundaries.map((boundary, gIdx) => {
                const categoryList = results.slice(
                  boundary.startIndex,
                  boundary.startIndex + boundary.count
                );

                return (
                  <div key={gIdx}>
                    {/* Category Label */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--color-accent)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        paddingBottom: '6px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        marginBottom: '8px',
                      }}
                    >
                      {getCategoryIcon(boundary.category as EntityCategory)}
                      <span>{categoryNames[boundary.category as EntityCategory]}</span>
                    </div>

                    {/* Result Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {categoryList.map((entity, i) => {
                        const itemIndex = boundary.startIndex + i;
                        const isHighlighted = itemIndex === activeIndex;

                        return (
                          <div
                            key={entity.id}
                            onClick={() => handleSelectEntity(entity)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              backgroundColor: isHighlighted ? 'rgba(var(--color-accent-rgb), 0.12)' : 'transparent',
                              border: isHighlighted ? '1px solid rgba(var(--color-accent-rgb), 0.3)' : '1px solid transparent',
                              transition: 'all var(--transition-fast)',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                            }}
                            onMouseOut={(e) => {
                              if (!isHighlighted) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              } else {
                                e.currentTarget.style.backgroundColor = 'rgba(var(--color-accent-rgb), 0.12)';
                              }
                            }}
                          >
                            <img
                              src={entity.image}
                              alt={entity.name}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                objectFit: 'cover',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {entity.name}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-secondary)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: isHero ? '500px' : '200px',
                                }}
                              >
                                {entity.description}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
