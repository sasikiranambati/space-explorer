import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InteractiveStarfield } from '../components/InteractiveStarfield';
import { NebulaBackground } from '../components/NebulaBackground';

export const RootLayout: React.FC = () => {
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
    </div>
  );
};
export default RootLayout;
