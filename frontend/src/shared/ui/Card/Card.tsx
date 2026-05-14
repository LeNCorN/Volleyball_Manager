import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className,
                                              onClick,
                                              hoverable = false,
                                              padding = 'md',
                                          }) => {
    return (
        <div
            className={clsx(
                styles.card,
                styles[padding],
                {
                    [styles.hoverable]: hoverable,
                    [styles.clickable]: !!onClick,
                },
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};