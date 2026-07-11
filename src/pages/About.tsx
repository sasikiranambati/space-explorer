import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { SectionTitle } from '../components/SectionTitle';
import { Terminal, Cpu, Layers, Code } from 'lucide-react';
import { allEntities, planets, moons, astronauts, rockets, agencies, missions } from '../services/mockData';

export const About: React.FC = () => {
  const specs = [
    { label: 'Core Framework', value: 'React 18.3.1' },
    { label: 'Programming Language', value: 'TypeScript 5.0+' },
    { label: 'Build Tool / Bundler', value: 'Vite 5.0+' },
    { label: 'Router System', value: 'React Router DOM 6.22+' },
    { label: 'Animation Engine', value: 'Framer Motion 11.0+' },
    { label: 'Vector Iconography', value: 'Lucide React 0.350+' },
    { label: 'Styling Base', value: 'Vanilla CSS Modules + Custom Tokens' },
  ];

  const dbCounts = [
    { label: 'Total Mapped Entities', value: allEntities.length },
    { label: 'Planets', value: planets.length },
    { label: 'Natural Satellites (Moons)', value: moons.length },
    { label: 'Astronauts Profiled', value: astronauts.length },
    { label: 'Launch Rockets', value: rockets.length },
    { label: 'Space Agencies', value: agencies.length },
    { label: 'Exploration Missions', value: missions.length },
  ];

  const terminalLogs = [
    { time: '16:12:21', level: 'SYSTEM', msg: 'Space Explorer engine initialization started...' },
    { time: '16:12:24', level: 'OK', msg: 'Connected to local JSON cosmological database registry.' },
    { time: '16:12:28', level: 'OK', msg: 'ThemeContext loaded successfully (Current: Slate Deep Cosmos).' },
    { time: '16:12:35', level: 'OK', msg: 'Starfield canvas buffer created. Generating 120 star nodes.' },
    { time: '16:12:40', level: 'WARN', msg: 'Nebula cloud particle blur limits scaled for performance.' },
    { time: '16:12:56', level: 'OK', msg: 'Routing nodes successfully mapped. System fully operational.' },
  ];

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
        title="Mission Control Station"
        subtitle="Technical details, repository dimensions, and developer system logs."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="about-grid">
        {/* Specifications Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GlassCard hoverScale={false}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} style={{ color: 'var(--color-accent)' }} />
              System Architecture
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {specs.map((spec, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '8px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                    fontSize: '0.88rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{spec.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hoverScale={false}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: 'var(--color-accent)' }} />
              Database Registry Counts
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {dbCounts.map((count, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                    {count.label}
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', display: 'block', marginTop: '4px' }}>
                    {count.value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Directory Structure & Terminal logs Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Mock Terminal Logs */}
          <GlassCard hoverScale={false} style={{ background: '#02040a', border: '1px solid #21262d', padding: 0 }}>
            {/* Terminal Header */}
            <div
              style={{
                background: '#161b22',
                padding: '12px 20px',
                borderBottom: '1px solid #21262d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <Terminal size={14} style={{ color: '#58a6ff' }} />
                <span>space-explorer-console.log</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
              </div>
            </div>

            {/* Terminal Body */}
            <div
              style={{
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '280px',
                overflowY: 'auto',
                color: '#c9d1d9',
              }}
            >
              {terminalLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#8b949e' }}>[{log.time}]</span>
                  <span
                    style={{
                      color: log.level === 'OK' ? '#58a6ff' : log.level === 'WARN' ? '#d29922' : '#ff7b72',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    {log.level}
                  </span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hoverScale={false}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} style={{ color: 'var(--color-accent)' }} />
              Visual Design Statement
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              The Space Explorer interface is built around high-fidelity dark cosmic design standards. Using deep obsidian backdrops, thin custom neon borders, active background canvas overlays, and strict typography rules (sans-serif Space Grotesk headings), it presents science registry statistics in a sleek, non-cartoon layout inspired by Git repositories and productivity tools like Linear or Vercel.
            </p>
          </GlassCard>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}} />
    </div>
  );
};
export default About;
