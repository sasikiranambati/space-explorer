import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: boolean;
  delay?: number;
  animateDirection?: 'up' | 'down' | 'left' | 'right' | 'none';
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverScale = true,
  delay = 0,
  animateDirection = 'up',
  style,
}) => {
  const getVariants = () => {
    if (animateDirection === 'none') {
      return {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
      };
    }

    const offsets = {
      up: { y: 25, x: 0 },
      down: { y: -25, x: 0 },
      left: { x: 25, y: 0 },
      right: { x: -25, y: 0 },
    };

    const offset = offsets[animateDirection];

    return {
      initial: {
        opacity: 0,
        x: offset.x,
        y: offset.y,
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
      },
    };
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // premium out-expo ease
      }}
      whileHover={hoverScale && onClick ? { y: -4, scale: 1.01 } : hoverScale ? { y: -2 } : {}}
      onClick={onClick}
      className={`glass ${className}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '24px',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
export default GlassCard;
