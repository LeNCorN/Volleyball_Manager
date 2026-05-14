import { apiClient } from '@shared/api/client';

export const matchApi = {
    getAll: (division?: string, status?: string) => {
        const params = { division, status };
        return apiClient.get('/matches', { params });
    },

    getById: (id: string) => {
        return apiClient.get(`/matches/${id}`);
    },

    getByTeam: (teamId: string) => {
        return apiClient.get(`/matches/team/${teamId}`);
    },
};