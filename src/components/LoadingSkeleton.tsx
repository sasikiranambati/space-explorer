import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'hero' | 'grid' | 'details';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
}) => {
  const pulseTransition = {
    duration: 1.2,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  };

  const renderSingle = (index: number) => {
    switch (variant) {
      case 'hero':
        return (
          <div key={index} style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '40px 0' }}>
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={pulseTransition}
              style={{ width: '280px', height: '48px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)' }}
            />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={pulseTransition}
              style={{ width: '450px', height: '24px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)' }}
            />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={pulseTransition}
              style={{ width: '100%', height: '56px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.04)', marginTop: '20px' }}
            />
          </div>
        );

      case 'grid':
        return (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>
            {Array.from({ length: count }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        );

      case 'details':
        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px 0' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={pulseTransition}
                style={{ width: '120px', height: '120px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.05)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={pulseTransition}
                  style={{ width: '250px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)' }}
                />
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={pulseTransition}
                  style={{ width: '100px', height: '20px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.03)' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={pulseTransition}
                  style={{ height: '100px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)' }}
                />
              ))}
            </div>

            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={pulseTransition}
              style={{ width: '100%', height: '180px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)' }}
            />
          </div>
        );

      case 'text':
        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={pulseTransition}
              style={{ width: '40%', height: '14px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.03)' }}
            />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={pulseTransition}
              style={{ width: '100%', height: '16px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)' }}
            />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={pulseTransition}
              style={{ width: '85%', height: '16px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)' }}
            />
          </div>
        );

      case 'card':
      default:
        return (
          <div
            key={index}
            className="glass"
            style={{
              padding: '24px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '320px',
              border: '1px solid rgba(255, 255, 255, 0.03)',
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={pulseTransition}
              style={{ width: '100%', height: '140px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}
            />
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={pulseTransition}
              style={{ width: '60%', height: '24px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={pulseTransition}
                style={{ width: '100%', height: '14px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.03)' }}
              />
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={pulseTransition}
                style={{ width: '80%', height: '14px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.03)' }}
              />
            </div>
          </div>
        );
    }
  };

  if (variant === 'grid') return renderSingle(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => renderSingle(i))}
    </div>
  );
};
export default LoadingSkeleton;
