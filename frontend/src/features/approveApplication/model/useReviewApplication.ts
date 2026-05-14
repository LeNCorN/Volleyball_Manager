import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi, ReviewApplicationDto } from '../api/applicationApi';

export const useReviewApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReviewApplicationDto }) =>
            applicationApi.review(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        },
    });
};