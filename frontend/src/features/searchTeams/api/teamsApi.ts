import { apiClient } from '@shared/api/client';

export interface TeamFilters {
    division?: string;
    search?: string;
}

export const teamsApi = {
    search: (filters: TeamFilters) => {
        return apiClient.get('/teams', { params: filters });
    },
};