import React from 'react';
import { LoginForm } from '@features/auth/ui/LoginForm';
import styles from './index.module.css';

const AdminLoginPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <LoginForm />
        </div>
    );
};

export default AdminLoginPage;