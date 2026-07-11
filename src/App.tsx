import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { RootLayout } from './layouts/RootLayout';

// Page Imports
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Details } from './pages/Details';
import { News } from './pages/News';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/:category/:id" element={<Details />} />
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
  );
}

export default App;
