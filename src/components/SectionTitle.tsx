import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  delay?: number;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`section-title-container ${className}`}
      style={{ marginBottom: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          {title}
        </h2>
        {/* Glow Line accent */}
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, var(--border-color), transparent)',
          }}
        />
      </div>
      {subtitle && (
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginTop: '4px',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
export default SectionTitle;
