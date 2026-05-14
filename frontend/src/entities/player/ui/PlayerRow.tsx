import React from 'react';
import styles from './PlayerRow.module.css';

interface PlayerRowProps {
    fullName: string;
    teamName?: string;
    position: string;
    skillLevel: string;
    heightCm: number;
    age: number;
    onClick?: () => void;
}

const positionLabels: Record<string, string> = {
    attacker: 'Нападающий',
    setter: 'Связующий',
    libero: 'Либеро',
    blocker: 'Блокирующий',
};

const skillLevelColors: Record<string, string> = {
    light: 'default',
    light_plus: 'info',
    light_plus_plus: 'info',
    medium: 'primary',
    medium_plus: 'primary',
    hard: 'danger',
    hard_plus: 'danger',
};

export const PlayerRow: React.FC<PlayerRowProps> = ({
                                                        fullName,
                                                        teamName,
                                                        position,
                                                        skillLevel,
                                                        heightCm,
                                                        age,
                                                        onClick,
                                                    }) => {
    // Получаем цвет для уровня
    const levelColor = skillLevelColors[skillLevel] || 'default';

    return (
        <div className={styles.row} onClick={onClick}>
            <span className={styles.name}>{fullName}</span>
            {teamName && <span className={styles.team}>{teamName}</span>}
            <span className={styles.position}>{positionLabels[position] || position}</span>
            <span className={`${styles.skillBadge} ${styles[levelColor]}`}>
        {skillLevel}
      </span>
            <span className={styles.height}>{heightCm} см</span>
            <span className={styles.age}>{age} лет</span>
        </div>
    );
};