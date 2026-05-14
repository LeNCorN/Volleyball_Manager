import { QueryProvider } from '@app/providers/QueryProvider';
import { RouterProvider } from '@app/providers/RouterProvider';
import { AuthProvider } from '@app/providers/AuthProvider';
import './app/styles/globals.css';

function App() {
    return (
        <QueryProvider>
            <AuthProvider>
                <RouterProvider />
            </AuthProvider>
        </QueryProvider>
    );
}

export default App;