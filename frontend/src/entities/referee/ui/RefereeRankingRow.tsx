import React from 'react';
import { Badge } from '@shared/ui';
import styles from './RefereeRankingRow.module.css';

interface RefereeRankingRowProps {
    place: number;
    fullName: string;
    matchesCount: number;
    score5: number;
    score4: number;
    score3: number;
    score2: number;
    averageScore: number;
    uniqueTeamsCount: number;
    finalScore: number;
}

export const RefereeRankingRow: React.FC<RefereeRankingRowProps> = ({
                                                                        place,
                                                                        fullName,
                                                                        matchesCount,
                                                                        score5,
                                                                        score4,
                                                                        score3,
                                                                        score2,
                                                                        averageScore,
                                                                        uniqueTeamsCount,
                                                                        finalScore,
                                                                    }) => {
    const getMedal = (place: number) => {
        if (place === 1) return '🥇';
        if (place === 2) return '🥈';
        if (place === 3) return '🥉';
        return place;
    };

    return (
        <div className={styles.row}>
            <div className={styles.place}>{getMedal(place)}</div>
            <div className={styles.name}>{fullName}</div>
            <div className={styles.matches}>{matchesCount}</div>
            <div className={styles.score5}>
                <Badge variant="success" size="sm">{score5}</Badge>
            </div>
            <div className={styles.score4}>
                <Badge variant="info" size="sm">{score4}</Badge>
            </div>
            <div className={styles.score3}>
                <Badge variant="warning" size="sm">{score3}</Badge>
            </div>
            <div className={styles.score2}>
                <Badge variant="default" size="sm">{score2}</Badge>
            </div>
            <div className={styles.average}>{averageScore.toFixed(2)}</div>
            <div className={styles.teams}>{uniqueTeamsCount}</div>
            <div className={styles.final}>{finalScore.toFixed(1)}</div>
        </div>
    );
};