import { apiClient } from '@shared/api/client';

export interface CreateTeamDto {
    name: string;
    division: string;
    captainName: string;
    emblemUrl?: string;
}

export interface UpdateTeamDto {
    name?: string;
    division?: string;
    captainName?: string;
    emblemUrl?: string;
    groupLetter?: string;
    isWaiting?: boolean;
}

export const teamApi = {
    getAll: (division?: string) => {
        const params = division ? { division } : {};
        return apiClient.get('/teams', { params });
    },

    getById: (id: string) => {
        return apiClient.get(`/teams/${id}`);
    },

    getWaitingList: () => {
        return apiClient.get('/teams/waiting-list');
    },

    create: (data: CreateTeamDto) => {
        return apiClient.post('/teams', data);
    },

    update: (id: string, data: UpdateTeamDto) => {
        return apiClient.patch(`/teams/${id}`, data);
    },

    delete: (id: string) => {
        return apiClient.delete(`/teams/${id}`);
    },
};