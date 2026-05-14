import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';

export const useWaitingList = () => {
    return useQuery({
        queryKey: ['waitingList'],
        queryFn: async () => {
            const response = await apiClient.get('/teams/waiting-list');
            return response.data;
        },
    });
};