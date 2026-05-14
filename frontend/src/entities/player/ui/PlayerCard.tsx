import React from 'react';
import { Card } from '@shared/ui';  // Убрали Button, так как он не используется
import { PlayerAvatar } from './PlayerAvatar';
import styles from './PlayerCard.module.css';

interface PlayerCardProps {
    id: string;
    fullName: string;
    teamName?: string;
    teamId?: string;
    division?: string;
    position: string;
    skillLevel: string;
    heightCm: number;
    age: number;
    mvpCount?: number;
    onSelect?: () => void;
}

const positionLabels: Record<string, string> = {
    attacker: 'Нападающий',
    setter: 'Связующий',
    libero: 'Либеро',
    blocker: 'Блокирующий',
};

const skillLevelLabels: Record<string, string> = {
    light: 'Лайт',
    light_plus: 'Лайт+',
    light_plus_plus: 'Лайт++',
    medium: 'Медиум',
    medium_plus: 'Медиум+',
    hard: 'Хард',
    hard_plus: 'Хард+',
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
                                                          fullName,
                                                          teamName,
                                                          division,
                                                          position,
                                                          skillLevel,
                                                          heightCm,
                                                          age,
                                                          mvpCount,
                                                          onSelect,
                                                      }) => {
    return (
        <Card hoverable onClick={onSelect} className={styles.card}>
            <div className={styles.header}>
                <PlayerAvatar name={fullName} size="md" />
                <div className={styles.headerInfo}>
                    <h4 className={styles.name}>{fullName}</h4>
                    {teamName && (
                        <span className={styles.team}>{teamName}</span>
                    )}
                    {division && (
                        <span className={`${styles.divisionBadge} ${division === 'hard' ? styles.hard : styles.light}`}>
              {division === 'hard' ? 'Хард' : 'Лайт'}
            </span>
                    )}
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Позиция</span>
                    <span className={styles.statValue}>{positionLabels[position] || position}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Уровень</span>
                    <span className={styles.statValue}>{skillLevelLabels[skillLevel] || skillLevel}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Рост</span>
                    <span className={styles.statValue}>{heightCm} см</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Возраст</span>
                    <span className={styles.statValue}>{age} лет</span>
                </div>
                {mvpCount !== undefined && (
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>MVP</span>
                        <span className={styles.statValue}>🏆 {mvpCount}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};