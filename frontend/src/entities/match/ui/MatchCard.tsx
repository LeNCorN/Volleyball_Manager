import React from 'react';
import { Card } from '@shared/ui';
import { MatchStatusBadge } from './MatchStatusBadge';
import styles from './MatchCard.module.css';

interface MatchCardProps {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    date: Date;
    time: string;
    court: string;
    status: string;
    onClick?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
                                                        homeTeam,
                                                        awayTeam,
                                                        homeScore,
                                                        awayScore,
                                                        date,
                                                        time,
                                                        court,
                                                        status,
                                                        onClick,
                                                    }) => {
    const isFinished = status === 'finished';

    return (
        <Card hoverable onClick={onClick} className={styles.card}>
            <div className={styles.header}>
        <span className={styles.date}>
          {new Date(date).toLocaleDateString('ru-RU')} {time}
        </span>
                <MatchStatusBadge status={status} />
            </div>

            <div className={styles.teams}>
                <span className={styles.team}>{homeTeam}</span>
                <span className={styles.score}>
          {isFinished ? `${homeScore ?? 0} : ${awayScore ?? 0}` : 'vs'}
        </span>
                <span className={styles.team}>{awayTeam}</span>
            </div>

            <div className={styles.footer}>
                <span>{court}</span>
            </div>
        </Card>
    );
};