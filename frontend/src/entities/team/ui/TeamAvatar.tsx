import React from 'react';
import clsx from 'clsx';
import styles from './TeamAvatar.module.css';

interface TeamAvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const TeamAvatar: React.FC<TeamAvatarProps> = ({
                                                          src,
                                                          name,
                                                          size = 'md',
                                                          className,
                                                      }) => {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map(word => word[0])
        .join('')
        .toUpperCase();

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={clsx(styles.avatar, styles[size], className)}
            />
        );
    }

    return (
        <div className={clsx(styles.avatar, styles.placeholder, styles[size], className)}>
            <span className={styles.initials}>{initials}</span>
        </div>
    );
};