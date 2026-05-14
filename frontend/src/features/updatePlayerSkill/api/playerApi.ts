import { apiClient } from '@shared/api/client';

export const playerApi = {
    updateSkill: (playerId: string, skillLevel: string) => {
        return apiClient.patch(`/players/${playerId}/skill`, { skillLevel });
    },
};