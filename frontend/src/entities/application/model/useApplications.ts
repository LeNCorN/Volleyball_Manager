import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../api/applicationApi';

export interface CreateApplicationPlayerDto {
    fullName: string;
    birthDate: string;
    heightCm: number;
    position: string;
    skillLevel: string;
}

export interface CreateApplicationDto {
    teamName: string;
    division: string;
    captainName: string;
    captainPhone: string;
    captainEmail: string;
    players: CreateApplicationPlayerDto[];
    emblemUrl?: string;
}

export interface ReviewApplicationParams {
    id: string;
    status: 'approved' | 'rejected';
    rejectionReason?: string;
}

export const useApplications = (status?: string) => {
    return useQuery({
        queryKey: ['applications', status],
        queryFn: () => applicationApi.getAll(status),
        select: (data) => data.data,
    });
};

export const useApplicationById = (id: string) => {
    return useQuery({
        queryKey: ['application', id],
        queryFn: () => applicationApi.getById(id),
        enabled: !!id,
        select: (data) => data.data,
    });
};

export const useCreateApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateApplicationDto) => applicationApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        },
    });
};

export const useReviewApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, rejectionReason }: ReviewApplicationParams) =>
            applicationApi.review(id, { status, rejectionReason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        },
    });
};