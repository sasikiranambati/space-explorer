import { useQuery } from '@tanstack/react-query';
import { getEntityDetail } from '../services/api';
import type { SpaceEntity, EntityCategory } from '../types';

export interface UseSpaceEntityResult {
  data: SpaceEntity | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useSpaceEntity(category: EntityCategory, id: string): UseSpaceEntityResult {
  const queryInfo = useQuery<SpaceEntity>({
    queryKey: ['spaceEntity', category, id],
    queryFn: () => getEntityDetail(category, id),
    enabled: !!category && !!id,
    staleTime: 15 * 60 * 1000, // Cache detail pages for 15 minutes
  });

  return {
    data: queryInfo.data,
    isLoading: queryInfo.isLoading,
    isError: queryInfo.isError,
  };
}
export default useSpaceEntity;
