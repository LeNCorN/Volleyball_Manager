import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, TournamentSettingsDto } from '../api/settingsApi';

export const useTournamentSettings = () => {
    return useQuery({
        queryKey: ['tournamentSettings'],
        queryFn: () => settingsApi.get(),
        select: (data) => data.data,
    });
};

export const useUpdateTournamentSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TournamentSettingsDto) => settingsApi.update(data),
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