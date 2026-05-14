import { apiClient } from '@shared/api/client';

export interface ReviewApplicationDto {
    status: 'approved' | 'rejected';
    rejectionReason?: string;
}

export const applicationApi = {
    review: (id: string, data: ReviewApplicationDto) => {
        return apiClient.patch(`/applications/${id}/review`, data);
    },
};