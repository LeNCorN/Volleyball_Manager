import { apiClient } from '@shared/api/client';

export interface CreateApplicationDto {
    teamName: string;
    division: string;
    captainName: string;
    captainPhone: string;
    captainEmail: string;
    players: Array<{
        fullName: string;
        birthDate: string;
        heightCm: number;
        position: string;
        skillLevel: string;
    }>;
    emblemUrl?: string;
}

export interface ReviewApplicationDto {
    status: 'approved' | 'rejected';
    rejectionReason?: string;
}

export const applicationApi = {
    getAll: (status?: string) => {
        const params = status ? { status } : {};
        return apiClient.get('/applications', { params });
    },

    getById: (id: string) => {
        return apiClient.get(`/applications/${id}`);
    },

    create: (data: CreateApplicationDto) => {
        return apiClient.post('/applications', data);
    },

    review: (id: string, data: ReviewApplicationDto) => {
        return apiClient.patch(`/applications/${id}/review`, data);
    },
};