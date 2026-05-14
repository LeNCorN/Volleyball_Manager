import React from 'react';
import { Card, Badge, RatingStars } from '@shared/ui';
import styles from './RefereeCard.module.css';

interface RefereeCardProps {
    id: string;
    fullName: string;
    phone?: string;
    email?: string;
    matchesCount?: number;
    averageScore?: number;
    onClick?: () => void;
}

export const RefereeCard: React.FC<RefereeCardProps> = ({
                                                            fullName,
                                                            phone,
                                                            email,
                                                            matchesCount,
                                                            averageScore,
                                                            onClick,
                                                        }) => {
    return (
        <Card hoverable onClick={onClick} className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar}>⚖️</div>
                <div>
                    <h4 className={styles.name}>{fullName}</h4>
                    {phone && <div className={styles.contact}>{phone}</div>}
                    {email && <div className={styles.contact}>{email}</div>}
                </div>
            </div>
            {matchesCount !== undefined && averageScore !== undefined && (
                <div className={styles.stats}>
                    <Badge variant="info">Матчей: {matchesCount}</Badge>
                    <div className={styles.rating}>
                        <RatingStars rating={Math.round(averageScore)} maxRating={5} size="sm" />
                        <span className={styles.score}>{averageScore.toFixed(1)} / 5</span>
                    </div>
                </div>
            )}
        </Card>
    );
};