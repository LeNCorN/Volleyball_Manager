import { useQuery } from '@tanstack/react-query';
import { teamsApi, TeamFilters } from '../api/teamsApi';

export const useTeamsSearch = (filters: TeamFilters) => {
    return useQuery({
        queryKey: ['teams', filters],
        queryFn: () => teamsApi.search(filters),
        select: (data) => data.data,
    });
};