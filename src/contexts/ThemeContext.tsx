import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'deep-cosmos' | 'nebula-purple';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('space-explorer-theme') as Theme;
    return saved || 'deep-cosmos';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'nebula-purple') {
      root.classList.add('theme-nebula-purple');
    } else {
      root.classList.remove('theme-nebula-purple');
    }
    localStorage.setItem('space-explorer-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'deep-cosmos' ? 'nebula-purple' : 'deep-cosmos'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
