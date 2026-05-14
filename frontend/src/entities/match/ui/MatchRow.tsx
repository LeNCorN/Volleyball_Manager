import React from 'react';
import { MatchStatusBadge } from './MatchStatusBadge';
import styles from './MatchRow.module.css';

interface MatchRowProps {
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

export const MatchRow: React.FC<MatchRowProps> = ({
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
        <div className={styles.row} onClick={onClick}>
            <div className={styles.date}>{new Date(date).toLocaleDateString('ru-RU')}</div>
            <div className={styles.time}>{time}</div>
            <div className={styles.court}>{court}</div>
            <div className={styles.teams}>
                <span>{homeTeam}</span>
                <span className={styles.score}>
          {isFinished ? `${homeScore ?? 0}:${awayScore ?? 0}` : 'vs'}
        </span>
                <span>{awayTeam}</span>
            </div>
            <div className={styles.status}>
                <MatchStatusBadge status={status} />
            </div>
        </div>
    );
};