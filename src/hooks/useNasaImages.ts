import { useQuery } from '@tanstack/react-query';
import { getNasaPlanetImages } from '../services/api';

export interface UseNasaImagesResult {
  data: string[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useNasaImages(planetName: string): UseNasaImagesResult {
  const queryInfo = useQuery<string[]>({
    queryKey: ['nasaImages', planetName],
    queryFn: () => getNasaPlanetImages(planetName),
    enabled: !!planetName,
    staleTime: 60 * 60 * 1000, // Cache NASA gallery images for 1 hour
  });

  return {
    data: queryInfo.data,
    isLoading: queryInfo.isLoading,
    isError: queryInfo.isError,
  };
}
export default useNasaImages;
