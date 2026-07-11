import { useQuery } from '@tanstack/react-query';
import { getPlanets, getMoons } from '../services/api';
import { getFeaturedEntities } from '../services/mockData';
import type { SpaceEntity } from '../types';

export function useFeaturedCosmos() {
  const planetsQuery = useQuery({
    queryKey: ['featuredPlanetsList'],
    queryFn: getPlanets,
    staleTime: 20 * 60 * 1000, // Planets list cached for 20 minutes
  });

  const moonsQuery = useQuery({
    queryKey: ['featuredMoonsList'],
    queryFn: getMoons,
    staleTime: 20 * 60 * 1000, // Moons list cached for 20 minutes
  });

  const featuredPlanets = planetsQuery.data?.filter(p => p.featured) || [];
  const featuredMoons = moonsQuery.data?.filter(m => m.featured) || [];

  // Merge with other mock category featured items (astronauts, rockets, agencies, missions)
  const otherFeatured = getFeaturedEntities().filter(
    entity => entity.category !== 'planet' && entity.category !== 'moon'
  );

  const data: SpaceEntity[] = [...featuredPlanets, ...featuredMoons, ...otherFeatured];

  return {
    data,
    isLoading: planetsQuery.isLoading || moonsQuery.isLoading,
    isError: planetsQuery.isError || moonsQuery.isError,
  };
}
export default useFeaturedCosmos;
