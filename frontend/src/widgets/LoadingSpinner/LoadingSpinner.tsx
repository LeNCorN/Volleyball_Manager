import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
    return (
        <div className={`${styles.spinner} ${styles[size]}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};