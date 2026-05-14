import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settingsApi';

export interface UpdateSettingsDto {
    name?: string;
    startDate?: string;
    endDate?: string;
    playDays?: string[];
    courtsCount?: number;
    courtsNames?: string[];
    matchDurationMinutes?: number;
    dayStartTime?: string;
    dayEndTime?: string;
}

export const useTournamentSettings = () => {
    return useQuery({
        queryKey: ['tournamentSettings'],
        queryFn: () => settingsApi.get(),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data,
    });
};

export const useUpdateTournamentSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSettingsDto) => settingsApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tournamentSettings'] });
        },
    });
};

export const useValidateSettings = () => {
    return useQuery({
        queryKey: ['tournamentSettingsValidate'],
        queryFn: () => settingsApi.validate(),
        enabled: false,
        select: (data) => data.data,
    });
};