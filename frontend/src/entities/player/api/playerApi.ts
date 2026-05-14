import { apiClient } from '@shared/api/client';

export interface PlayerFilters {
    division?: string;
    position?: string;
    skillLevel?: string;
    search?: string;
    teamId?: string;
}

export interface CreatePlayerDto {
    fullName: string;
    birthDate: string;
    heightCm: number;
    position: string;
    skillLevel: string;
    teamId?: string;
}

export interface UpdatePlayerDto {
    fullName?: string;
    birthDate?: string;
    heightCm?: number;
    position?: string;
    skillLevel?: string;
}

export const playerApi = {
    getAll: (filters?: PlayerFilters) => {
        return apiClient.get('/players', { params: filters });
    },

    getById: (id: string) => {
        return apiClient.get(`/players/${id}`);
    },

    getByTeam: (teamId: string) => {
        return apiClient.get(`/players/team/${teamId}`);
    },

    create: (data: CreatePlayerDto) => {
        return apiClient.post('/players', data);
    },

    update: (id: string, data: UpdatePlayerDto) => {
        return apiClient.patch(`/players/${id}`, data);
    },

    updateSkill: (id: string, skillLevel: string) => {
        return apiClient.patch(`/players/${id}/skill`, { skillLevel });
    },

    delete: (id: string) => {
        return apiClient.delete(`/players/${id}`);
    },
};