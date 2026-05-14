import { apiClient } from '@shared/api/client';

export interface CreateSeasonDto {
    name: string;
    startDate: string;
    endDate: string;
    weeksCount?: number;
}

export const seasonApi = {
    getCurrent: () => {
        return apiClient.get('/season/current');
    },

    getAll: () => {
        return apiClient.get('/season/all');
    },

    getStatus: () => {
        return apiClient.get('/season/status');
    },

    create: (data: CreateSeasonDto) => {
        return apiClient.post('/season', data);
    },

    activate: (seasonId: number) => {
        return apiClient.post(`/season/${seasonId}/activate`);
    },

    close: (data: { archiveResults?: boolean }) => {
        return apiClient.post('/season/close', data);
    },
};