import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Alert } from '@shared/ui';
import { useLogin } from '../model/useAuth';
import { LoginCredentials } from '../api/authApi';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
    const loginMutation = useLogin();

    const onSubmit = (data: LoginCredentials) => {
        loginMutation.mutate(data);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.icon}>🔐</div>
                    <h2>Вход в админ-панель</h2>
                    <p>Введите свои учетные данные</p>
                </div>

                {loginMutation.isError && (
                    <Alert type="error" message="Неверный логин или пароль" />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Input
                        label="Логин"
                        placeholder="admin"
                        error={errors.username?.message}
                        {...register('username', { required: 'Введите логин' })}
                        fullWidth
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        placeholder="••••••"
                        error={errors.password?.message}
                        {...register('password', { required: 'Введите пароль' })}
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loginMutation.isPending}
                    >
                        Войти
                    </Button>
                </form>
            </div>
        </div>
    );
};