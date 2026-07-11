import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from './GlassCard';
import { ArrowUpRight } from 'lucide-react';
import type { EntityCategory } from '../types';

interface CategoryCardProps {
  name: string;
  category: EntityCategory;
  icon: React.ReactNode;
  count: number;
  description: string;
  delay?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  category,
  icon,
  count,
  description,
  delay = 0,
}) => {
  const navigate = useNavigate();

  return (
    <GlassCard
      onClick={() => navigate(`/explore?category=${category}`)}
      delay={delay}
      hoverScale={true}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '220px',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Category Icon Badge */}
        <div
          style={{
            padding: '12px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        {/* Small arrow indicator */}
        <div
          className="arrow-indicator"
          style={{
            color: 'var(--text-muted)',
            transition: 'transform var(--transition-normal), color var(--transition-normal)',
          }}
        >
          <ArrowUpRight size={18} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
          }}
        >
          {name}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {count} profiles
          </span>
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
      </div>
    </GlassCard>
  );
};
export default CategoryCard;
