import React from 'react';

export const NebulaBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Nebula Blue/Cyan Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(34, 211, 238, 0.03) 50%, transparent 100%)',
          filter: 'blur(100px)',
          animation: 'pulse-glow 15s ease-in-out infinite alternate',
        }}
      />

      {/* Nebula Purple/Pink Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '5%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.03) 50%, transparent 100%)',
          filter: 'blur(120px)',
          animation: 'pulse-glow 20s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Center Deep Cosmic Dust */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '30%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.02) 60%, transparent 100%)',
          filter: 'blur(90px)',
          animation: 'pulse-glow 25s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
};
