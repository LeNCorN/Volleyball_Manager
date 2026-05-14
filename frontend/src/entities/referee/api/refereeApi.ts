import { apiClient } from '@shared/api/client';

export interface CreateRefereeDto {
    fullName: string;
    phone?: string;
    email?: string;
}

export const refereeApi = {
    getRanking: () => {
        return apiClient.get('/referees/rankings');
    },

    getAll: () => {
        return apiClient.get('/referees');
    },

    create: (data: CreateRefereeDto) => {
        return apiClient.post('/referees', data);
    },

    rate: (matchId: string, teamId: string, refereeId: string, score: number) => {
        return apiClient.post(`/referees/match/${matchId}/team/${teamId}/rate`, {
            refereeId,
            score,
        });
    },
};