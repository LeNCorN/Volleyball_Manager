import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, LoginCredentials } from '../api/authApi';
import { tokenStorage } from '../lib/tokenStorage';
import { ROUTES } from '@shared/lib/constants/routes';

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (response) => {
            tokenStorage.set(response.data.access_token);
            navigate(ROUTES.ADMIN_DASHBOARD);
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();

    return () => {
        tokenStorage.remove();
        navigate(ROUTES.ADMIN_LOGIN);
    };
};