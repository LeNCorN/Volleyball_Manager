import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@shared/ui';  // Убрали Badge
import { TeamAvatar } from './TeamAvatar';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './TeamCard.module.css';

interface TeamCardProps {
    id: string;
    name: string;
    division: string;
    captainName: string;
    emblemUrl?: string;
    playersCount?: number;
    avgHeight?: number;
    avgAge?: number;
    compact?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({
                                                      id,
                                                      name,
                                                      division,
                                                      captainName,
                                                      emblemUrl,
                                                      playersCount,
                                                      avgHeight,
                                                      avgAge,
                                                      compact = false,
                                                  }) => {
    const divisionLabel = division === 'hard' ? 'Хард-лига' : 'Лайт-лига';
    const divisionColor = division === 'hard' ? 'danger' : 'success';

    if (compact) {
        return (
            <Link to={ROUTES.TEAM_DETAILS(id)} className={styles.link}>
                <Card hoverable padding="sm" className={styles.compactCard}>
                    <div className={styles.compactContent}>
                        <TeamAvatar src={emblemUrl} name={name} size="sm" />
                        <div className={styles.compactInfo}>
                            <span className={styles.compactName}>{name}</span>
                            {/* Убрали Badge, используем простой текст */}
                            <span className={`${styles.badge} ${styles[divisionColor]}`}>
                {divisionLabel}
              </span>
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    return (
        <Card hoverable className={styles.card}>
            <div className={styles.header}>
                <TeamAvatar src={emblemUrl} name={name} size="lg" />
                <div className={styles.headerInfo}>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={`${styles.badge} ${styles[divisionColor]}`}>
            {divisionLabel}
          </span>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Капитан:</span>
                    <span className={styles.detailValue}>{captainName}</span>
                </div>
                {playersCount !== undefined && (
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Игроков:</span>
                        <span className={styles.detailValue}>{playersCount}</span>
                    </div>
                )}
                {avgHeight !== undefined && (
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Средний рост:</span>
                        <span className={styles.detailValue}>{avgHeight} см</span>
                    </div>
                )}
                {avgAge !== undefined && (
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Средний возраст:</span>
                        <span className={styles.detailValue}>{avgAge} лет</span>
                    </div>
                )}
            </div>

            <Link to={ROUTES.TEAM_DETAILS(id)}>
                <Button variant="outline" size="sm" fullWidth>
                    Подробнее →
                </Button>
            </Link>
        </Card>
    );
};