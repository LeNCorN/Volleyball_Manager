import { useMutation, useQueryClient } from '@tanstack/react-query';
import { protocolApi, InputProtocolDto } from '../api/protocolApi';

export const useMatchProtocol = (matchId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InputProtocolDto) => protocolApi.inputProtocol(matchId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['match', matchId] });
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            queryClient.invalidateQueries({ queryKey: ['standings'] });
        },
    });
};