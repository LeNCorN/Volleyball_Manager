import { apiClient } from '@shared/api/client';

export interface TournamentSettingsDto {
    name?: string;
    startDate?: string;
    endDate?: string;
    playDays?: string[];
    courtsCount?: number;
    courtsNames?: string | string[];  // разрешаем оба типа
    matchDurationMinutes?: number;
    dayStartTime?: string;
    dayEndTime?: string;
}

export const settingsApi = {
    get: () => {
        return apiClient.get('/tournament-settings');
    },

    update: (data: TournamentSettingsDto) => {
        // Если courtsNames строка, преобразуем в массив
        const formattedData = {
            ...data,
            courtsNames: typeof data.courtsNames === 'string' && data.courtsNames
                ? data.courtsNames.split(',').map(s => s.trim())
                : data.courtsNames,
        };
        return apiClient.put('/tournament-settings', formattedData);
    },

    validate: () => {
        return apiClient.get('/tournament-settings/validate');
    },
};