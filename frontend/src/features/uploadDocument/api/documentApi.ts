import { apiClient } from '@shared/api/client';

export const documentApi = {
    upload: (formData: FormData) => {
        return apiClient.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};