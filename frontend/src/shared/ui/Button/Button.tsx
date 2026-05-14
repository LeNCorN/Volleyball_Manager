import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  size = 'md',
                                                  loading = false,
                                                  fullWidth = false,
                                                  children,
                                                  disabled,
                                                  className,
                                                  ...props
                                              }) => {
    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                {
                    [styles.fullWidth]: fullWidth,
                    [styles.loading]: loading,
                },
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className={styles.spinner}></span>}
            <span>{children}</span>
        </button>
    );
};