import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '../routing/AppRouter';

export const RouterProvider = () => {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
};