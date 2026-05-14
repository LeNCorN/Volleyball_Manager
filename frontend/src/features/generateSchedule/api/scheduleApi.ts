import { apiClient } from '@shared/api/client';

export interface GenerateScheduleParams {
    overwrite?: boolean;
}

export const scheduleApi = {
    generate: (params?: GenerateScheduleParams) => {
        return apiClient.post('/schedule/generate', null, { params });
    },

    getSchedule: (division?: string, group?: string) => {
        const params = { division, group };
        return apiClient.get('/schedule', { params });
    },

    clearSchedule: () => {
        return apiClient.delete('/schedule/clear');
    },
};