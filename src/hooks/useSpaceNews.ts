import { useQuery } from '@tanstack/react-query';
import { getNewsArticles } from '../services/api';
import type { NewsItem } from '../types';

export interface UseSpaceNewsResult {
  data: NewsItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useSpaceNews(category?: string): UseSpaceNewsResult {
  const queryInfo = useQuery<NewsItem[]>({
    queryKey: ['spaceNews', category || 'All'],
    queryFn: () => getNewsArticles(category),
    staleTime: 5 * 60 * 1000, // News feed cached for 5 minutes
  });

  return {
    data: queryInfo.data,
    isLoading: queryInfo.isLoading,
    isError: queryInfo.isError,
  };
}
export default useSpaceNews;
