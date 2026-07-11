import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SpaceEntity } from '../types';

interface FavoritesContextType {
  favorites: SpaceEntity[];
  toggleFavorite: (entity: SpaceEntity) => void;
  isFavorite: (category: string, id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<SpaceEntity[]>(() => {
    try {
      const saved = localStorage.getItem('space-explorer-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('space-explorer-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (entity: SpaceEntity) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.category === entity.category && item.id === entity.id);
      if (exists) {
        return prev.filter(item => !(item.category === entity.category && item.id === entity.id));
      } else {
        return [...prev, entity];
      }
    });
  };

  const isFavorite = (category: string, id: string) => {
    return favorites.some(item => item.category === category && item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
