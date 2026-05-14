import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playerApi } from '../api/playerApi';

export const useUpdatePlayerSkill = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ playerId, skillLevel }: { playerId: string; skillLevel: string }) =>
            playerApi.updateSkill(playerId, skillLevel),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
            queryClient.invalidateQueries({ queryKey: ['player'] });
        },
    });
};