import { apiClient } from '@shared/api/client';

export const settingsApi = {
    get: () => {
        return apiClient.get('/tournament-settings');
    },

    update: (data: UpdateSettingsDto) => {
        return apiClient.put('/tournament-settings', data);
    },

    validate: () => {
        return apiClient.get('/tournament-settings/validate');
    },
};

export interface UpdateSettingsDto {
    name?: string;
    startDate?: string;
    endDate?: string;
    playDays?: string[];
    courtsCount?: number;
    courtsNames?: string[];
    matchDurationMinutes?: number;
    dayStartTime?: string;
    dayEndTime?: string;
}