import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './routePaths';

export const AdminRoute = () => {
    const token = localStorage.getItem('admin_token');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
    }

    return <Outlet />;
};