import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api/teamApi';
import { useTeamStore } from './teamStore';
import React from 'react';

export const useTeamById = (id: string | undefined) => {
    const setSelectedTeam = useTeamStore((state) => state.setSelectedTeam);

    const query = useQuery({
        queryKey: ['team', id],
        queryFn: () => teamApi.getById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        select: (data) => data.data,
    });

    // Используем useEffect вместо onSuccess
    React.useEffect(() => {
        if (query.data) {
            setSelectedTeam(query.data);
        }
    }, [query.data, setSelectedTeam]);

    return query;
};