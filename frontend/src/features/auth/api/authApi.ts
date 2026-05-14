import { apiClient } from '@shared/api/client';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    username: string;
    role: string;
}

export const authApi = {
    login: (credentials: LoginCredentials) => {
        return apiClient.post<LoginResponse>('/admin/login', credentials);
    },

    getProfile: () => {
        return apiClient.get('/admin/profile');
    },

    verifyToken: () => {
        return apiClient.post('/admin/verify');
    },

    logout: () => {
        return apiClient.post('/admin/logout');
    },
};