import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpaceNews } from '../hooks/useSpaceNews';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { GlassCard } from '../components/GlassCard';
import { SectionTitle } from '../components/SectionTitle';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: newsItems, isLoading, isError } = useSpaceNews(activeCategory);
  const filteredNews = newsItems || [];

  const categories = ['All', 'Missions', 'Science', 'Technology', 'Astrophysics'];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
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
        title="Cosmos Intelligence Hub"
        subtitle="Recent orbital dispatches, aerospace engineering logs, and space discoveries."
      />

      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        }}
      >
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`category-tag ${isActive ? 'active' : ''}`}
              style={{ border: 'none' }}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* News Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <AnimatePresence mode="popLayout">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSkeleton variant="card" count={3} />
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
              title="Could not connect to news feed"
              description="The space news server is temporarily offline. Fallback logs are displaying."
              onReset={() => setActiveCategory('All')}
              resetLabel="Reload Feed"
            />
          </motion.div>
        ) : filteredNews.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No current news articles matched this filter.
          </div>
        ) : (
          filteredNews.map((item, i) => {
            const isExpanded = expandedId === item.id;
            return (
              <GlassCard
                key={item.id}
                hoverScale={!isExpanded}
                delay={Math.min(i * 0.05, 0.3)}
                style={{
                  padding: 0,
                  borderRadius: '16px',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }} className="news-layout">
                  {/* Left Thumbnail */}
                  <div style={{ height: '220px', overflow: 'hidden' }} className="news-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Right Details */}
                  <div
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Meta information */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(var(--color-accent-rgb), 0.1)',
                            border: '1px solid rgba(var(--color-accent-rgb), 0.15)',
                            color: 'var(--color-accent)',
                            fontWeight: 600,
                          }}
                        >
                          {item.category}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {item.publishedDate}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {item.readTime}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {item.title}
                      </h3>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {item.summary}
                      </p>
                    </div>

                    {/* Extended article column */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            overflow: 'hidden',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            paddingTop: '16px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div style={{ whiteSpace: 'pre-wrap' }}>{item.content}</div>
                          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Source: {item.source}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand Trigger Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <button
                        onClick={() => toggleExpand(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-accent)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 0',
                        }}
                      >
                        <span>{isExpanded ? 'Collapse Article' : 'Read Full Article'}</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .news-layout {
            grid-template-columns: 240px 1fr !important;
          }
          .news-image-wrapper {
            height: 100% !important;
          }
        }
      `}} />
    </div>
  );
};
export default News;
