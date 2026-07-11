import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InteractiveStarfield } from '../components/InteractiveStarfield';
import { NebulaBackground } from '../components/NebulaBackground';
import { CommandPalette } from '../components/CommandPalette';
import { SpaceAssistant } from '../components/SpaceAssistant';

export const RootLayout: React.FC = () => {
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="layout-container">
      {/* Background visual layers */}
      <NebulaBackground />
      <InteractiveStarfield />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Screen Outlet */}
      <main className="main-content" style={{ position: 'relative', zIndex: 10 }}>
        <Outlet />
      </main>

      {/* Footer System */}
      <Footer />

      {/* Global search palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

      {/* Global AI Space Assistant */}
      <SpaceAssistant />
    </div>
  );
};
export default RootLayout;
