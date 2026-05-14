import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seasonApi } from '../api/seasonApi';

export interface CreateSeasonDto {
    name: string;
    startDate: string;
    endDate: string;
    weeksCount?: number;
}

export const useCurrentSeason = () => {
    return useQuery({
        queryKey: ['currentSeason'],
        queryFn: () => seasonApi.getCurrent(),
        select: (data) => data.data,
    });
};

export const useAllSeasons = () => {
    return useQuery({
        queryKey: ['allSeasons'],
        queryFn: () => seasonApi.getAll(),
        select: (data) => data.data,
    });
};

export const useSeasonStatus = () => {
    return useQuery({
        queryKey: ['seasonStatus'],
        queryFn: () => seasonApi.getStatus(),
        select: (data) => data.data,
    });
};

export const useCreateSeason = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSeasonDto) => seasonApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allSeasons'] });
            queryClient.invalidateQueries({ queryKey: ['currentSeason'] });
        },
    });
};

export const useCloseSeason = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (archiveResults?: boolean) => seasonApi.close({ archiveResults }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentSeason'] });
            queryClient.invalidateQueries({ queryKey: ['seasonStatus'] });
        },
    });
};