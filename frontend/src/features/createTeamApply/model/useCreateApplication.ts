import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applicationApi, CreateApplicationDto } from '../api/applicationApi';
import { ROUTES } from '@shared/lib/constants/routes';

export const useCreateApplication = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: CreateApplicationDto) => applicationApi.create(data),
        onSuccess: () => {
            navigate(ROUTES.HOME);
        },
    });
};