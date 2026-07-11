import React from 'react';
import { GlassCard } from './GlassCard';
import { ShieldAlert, Inbox, Search } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  description: string;
  icon?: 'error' | 'empty' | 'search';
  onReset?: () => void;
  resetLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  icon = 'empty',
  onReset,
  resetLabel = 'Go Back',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'error':
        return <ShieldAlert size={48} style={{ color: '#ef4444' }} />;
      case 'search':
        return <Search size={48} style={{ color: 'var(--color-accent)' }} />;
      case 'empty':
      default:
        return <Inbox size={48} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', width: '100%', padding: '24px' }}>
      <GlassCard
        hoverScale={false}
        animateDirection="up"
        style={{
          maxWidth: '480px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          padding: '40px 32px',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px',
          }}
        >
          {getIcon()}
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {description}
        </p>

        {onReset && (
          <button
            onClick={onReset}
            style={{
              marginTop: '12px',
              padding: '10px 24px',
              borderRadius: '20px',
              background: 'rgba(var(--color-accent-rgb), 0.1)',
              border: '1px solid var(--color-accent)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget;
              el.style.background = 'var(--color-accent)';
              el.style.color = '#000000';
              el.style.boxShadow = '0 0 16px var(--color-accent)';
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget;
              el.style.background = 'rgba(var(--color-accent-rgb), 0.1)';
              el.style.color = 'var(--text-primary)';
              el.style.boxShadow = 'none';
            }}
          >
            {resetLabel}
          </button>
        )}
      </GlassCard>
    </div>
  );
};
export default ErrorState;
