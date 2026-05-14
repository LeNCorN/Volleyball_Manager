import React from 'react';
import styles from './DocumentCategoryBadge.module.css';

interface DocumentCategoryBadgeProps {
    category: string;
}

const categoryLabels: Record<string, string> = {
    regulations: 'Регламент',
    volleyball_rules: 'Правила волейбола',
    referee_rules: 'Правила судейства',
    other: 'Другое',
};

export const DocumentCategoryBadge: React.FC<DocumentCategoryBadgeProps> = ({ category }) => {
    const label = categoryLabels[category] || category;
    const categoryClass = styles[category] || styles.other;

    return (
        <span className={`${styles.badge} ${categoryClass}`}>
      {label}
    </span>
    );
};