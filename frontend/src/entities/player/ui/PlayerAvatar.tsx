import React from 'react';
import clsx from 'clsx';
import styles from './PlayerAvatar.module.css';

interface PlayerAvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ src, name, size = 'md' }) => {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map(word => word[0])
        .join('')
        .toUpperCase();

    if (src) {
        return <img src={src} alt={name} className={clsx(styles.avatar, styles[size])} />;
    }

    return (
        <div className={clsx(styles.avatar, styles.placeholder, styles[size])}>
            <span className={styles.initials}>{initials}</span>
        </div>
    );
};