import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  delay = 0,
}) => {
  return (
    <GlassCard hoverScale={true} delay={delay}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              wordBreak: 'break-word',
            }}
          >
            {value}
          </span>
        </div>
        <div
          style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(var(--color-accent-rgb), 0.08)',
            border: '1px solid rgba(var(--color-accent-rgb), 0.15)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '16px',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          {trend.isPositive ? (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} />
              {trend.value}
            </span>
          ) : (
            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingDown size={14} />
              {trend.value}
            </span>
          )}
          <span style={{ color: 'var(--text-muted)' }}>vs target standard</span>
        </div>
      )}
    </GlassCard>
  );
};
export default StatCard;
