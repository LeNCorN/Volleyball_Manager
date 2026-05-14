import { apiClient } from '@shared/api/client';

export interface UpdateDocumentDto {
    title?: string;
    description?: string;
    category?: string;
    isPublished?: boolean;
}

export const documentApi = {
    getAll: (category?: string) => {
        const params = category ? { category } : {};
        return apiClient.get('/documents', { params });
    },

    getById: (id: string) => {
        return apiClient.get(`/documents/${id}`);
    },

    download: (id: string) => {
        return apiClient.get(`/documents/${id}/download`, {
            responseType: 'blob',
        });
    },

    upload: (formData: FormData) => {
        return apiClient.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    update: (id: string, data: UpdateDocumentDto) => {
        return apiClient.put(`/documents/${id}`, data);
    },

    delete: (id: string) => {
        return apiClient.delete(`/documents/${id}`);
    },
};