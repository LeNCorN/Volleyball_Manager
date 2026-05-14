import React from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.css';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary' }) => {
    return (
        <div className={clsx(styles.spinner, styles[size], styles[color])}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};