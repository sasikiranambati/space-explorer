import { useQuery } from '@tanstack/react-query';
import { getNasaApod } from '../services/api';

export function useNasaApod() {
  return useQuery({
    queryKey: ['nasa-apod'],
    queryFn: getNasaApod,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });
}
