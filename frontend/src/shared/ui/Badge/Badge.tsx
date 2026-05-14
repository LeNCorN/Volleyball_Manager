import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
    size?: 'sm' | 'md';
    rounded?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
                                                children,
                                                variant = 'default',
                                                size = 'md',
                                                rounded = false,
                                            }) => {
    return (
        <span
            className={clsx(
                styles.badge,
                styles[variant],
                styles[size],
                {
                    [styles.rounded]: rounded,
                }
            )}
        >
      {children}
    </span>
    );
};