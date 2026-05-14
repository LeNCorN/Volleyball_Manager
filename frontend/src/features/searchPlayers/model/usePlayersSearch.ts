import { useQuery } from '@tanstack/react-query';
import { playersApi, PlayerFilters } from '../api/playersApi';

export const usePlayersSearch = (filters: PlayerFilters) => {
    return useQuery({
        queryKey: ['players', filters],
        queryFn: () => playersApi.search(filters),
        select: (data) => data.data,
    });
};