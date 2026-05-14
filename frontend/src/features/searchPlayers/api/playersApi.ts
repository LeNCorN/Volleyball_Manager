import { apiClient } from '@shared/api/client';

export interface PlayerFilters {
    division?: string;
    position?: string;
    skillLevel?: string;
    search?: string;
    teamId?: string;
}

export const playersApi = {
    search: (filters: PlayerFilters) => {
        return apiClient.get('/players', { params: filters });
    },
};