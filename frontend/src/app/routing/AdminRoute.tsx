import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
export const AdminRoute = () => {
    const token = localStorage.getItem('admin_token');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
    }

    return <Outlet />;
};