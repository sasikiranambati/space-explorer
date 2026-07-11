import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { RootLayout } from './layouts/RootLayout';

// Page Imports
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { PlanetDetails } from './pages/PlanetDetails';
import { MissionDetails } from './pages/MissionDetails';
import { AstronautDetails } from './pages/AstronautDetails';
import { RocketDetails } from './pages/RocketDetails';
import { SolarSystem } from './pages/SolarSystem';
import { Compare } from './pages/Compare';
import { Details } from './pages/Details';
import { News } from './pages/News';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { MoonDetails } from './pages/MoonDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000,    // 30 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/planet/:id" element={<PlanetDetails />} />
              <Route path="/explore/mission/:id" element={<MissionDetails />} />
              <Route path="/explore/astronaut/:id" element={<AstronautDetails />} />
              <Route path="/explore/rocket/:id" element={<RocketDetails />} />
              <Route path="/explore/moon/:id" element={<MoonDetails />} />
              <Route path="/explore/:category/:id" element={<Details />} />
              <Route path="/solar-system" element={<SolarSystem />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/news" element={<News />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
