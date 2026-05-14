import { useQuery } from '@tanstack/react-query';
import { playerApi } from '../api/playerApi';
import { usePlayerStore } from './playerStore';
import React from 'react';

export const usePlayerById = (id: string | undefined) => {
    const setSelectedPlayer = usePlayerStore((state) => state.setSelectedPlayer);

    const query = useQuery({
        queryKey: ['player', id],
        queryFn: () => playerApi.getById(id!),
        enabled: !!id,
        select: (data) => data.data,
    });

    React.useEffect(() => {
        if (query.data) {
            setSelectedPlayer(query.data);
        }
    }, [query.data, setSelectedPlayer]);

    return query;
};