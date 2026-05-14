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

export const applicationApi = {
    create: (data: CreateApplicationDto) => {
        return apiClient.post('/applications', data);
    },
};