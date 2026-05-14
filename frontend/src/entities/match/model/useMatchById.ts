import { useQuery } from '@tanstack/react-query';
import { matchApi } from '../api/matchApi';

export const useMatchById = (id: string | undefined) => {
    return useQuery({
        queryKey: ['match', id],
        queryFn: () => matchApi.getById(id!),
        enabled: !!id,
        select: (data) => data.data,
    });
};