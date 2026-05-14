import { useQuery } from '@tanstack/react-query';
import { documentApi } from '../api/documentApi';

export const useDocuments = (category?: string) => {
    return useQuery({
        queryKey: ['documents', category],
        queryFn: () => documentApi.getAll(category),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data,
    });
};