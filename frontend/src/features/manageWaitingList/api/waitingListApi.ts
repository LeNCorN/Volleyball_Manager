import { apiClient } from '@shared/api/client';

export const waitingListApi = {
    getWaitingList: () => {
        return apiClient.get('/teams/waiting-list');
    },
};