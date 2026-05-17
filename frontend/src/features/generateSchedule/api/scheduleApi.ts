// frontend/src/features/generateSchedule/api/scheduleApi.ts

import { apiClient } from '@shared/api/client';

export interface GenerateScheduleParams {
    overwrite?: boolean;
}

export const scheduleApi = {
    generate: async (params?: GenerateScheduleParams) => {
        // Отправляем пустой объект, если нет параметров, вместо null
        const body = params ? { overwrite: params.overwrite } : {};
        return apiClient.post('/schedule/generate', body);
    },

    getSchedule: (division?: string, group?: string) => {
        const params = { division, group };
        return apiClient.get('/schedule', { params });
    },

    clearSchedule: () => {
        return apiClient.delete('/schedule/clear');
    },
};