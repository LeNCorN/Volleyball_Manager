// frontend/src/features/generateSchedule/model/useGenerateSchedule.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi, GenerateScheduleParams } from '../api/scheduleApi';

export const useGenerateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params?: GenerateScheduleParams) => scheduleApi.generate(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule'] });
        },
    });
};

export const useClearSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => scheduleApi.clearSchedule(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule'] });
        },
    });
};