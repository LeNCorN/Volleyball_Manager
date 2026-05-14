import { useQuery } from '@tanstack/react-query';
import { refereeApi } from '../api/refereeApi';

export const useRefereeRanking = () => {
    return useQuery({
        queryKey: ['refereeRanking'],
        queryFn: () => refereeApi.getRanking(),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data,
    });
};

export const useReferees = () => {
    return useQuery({
        queryKey: ['referees'],
        queryFn: () => refereeApi.getAll(),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data,
    });
};