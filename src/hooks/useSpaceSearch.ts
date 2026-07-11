import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { querySpaceEntities, getPlanets, getMoons, getNewsArticles } from '../services/api';
import * as mock from '../services/mockData';
import type { SpaceEntity, EntityCategory } from '../types';

export interface UseSpaceSearchResult {
  data: SpaceEntity[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useSpaceSearch(query: string, categoryFilter?: string): UseSpaceSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const cat = categoryFilter || 'all';

  const queryInfo = useQuery<SpaceEntity[]>({
    queryKey: ['spaceSearch', debouncedQuery, cat],
    queryFn: async () => {
      // If search query is empty, return default listing for the active category
      if (!debouncedQuery.trim()) {
        if (cat === 'planet') {
          return await getPlanets();
        } else if (cat === 'moon') {
          return await getMoons();
        } else if (cat === 'news') {
          const newsItems = await getNewsArticles();
          return newsItems.map(item => ({
            id: item.id,
            name: item.title,
            category: 'news' as EntityCategory,
            description: item.summary,
            image: item.image,
          } as unknown as SpaceEntity));
        } else if (cat !== 'all') {
          return mock.getEntitiesByCategory(cat as EntityCategory);
        } else {
          const p = await getPlanets();
          const m = await getMoons();
          const rest = mock.allEntities.filter(
            entity => entity.category !== 'planet' && entity.category !== 'moon'
          );
          return [...p, ...m, ...rest];
        }
      }
      
      // If search query is entered, run live global API search
      return querySpaceEntities(debouncedQuery, categoryFilter);
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: queryInfo.data,
    isLoading: queryInfo.isLoading,
    isError: queryInfo.isError,
  };
}
export default useSpaceSearch;
