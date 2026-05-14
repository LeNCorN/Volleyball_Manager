import React from 'react';
import styles from './MatchStatusBadge.module.css';

interface MatchStatusBadgeProps {
    status: string;
}

const statusLabels: Record<string, string> = {
    scheduled: 'Запланирован',
    in_progress: 'В процессе',
    finished: 'Завершён',
    forfeit: 'Техническое поражение',
};

export const MatchStatusBadge: React.FC<MatchStatusBadgeProps> = ({ status }) => {
    const label = statusLabels[status] || status;
    const statusClass = styles[status] || styles.scheduled;

    return (
        <span className={`${styles.badge} ${statusClass}`}>
      {label}
    </span>
    );
};