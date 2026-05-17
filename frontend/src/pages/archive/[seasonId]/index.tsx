import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { StandingsTable } from '@widgets/StandingsTable/StandingsTable';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { MatchResultTooltip } from '@widgets/MatchResultTooltip/MatchResultTooltip';
import { ROUTES } from '@shared/lib/constants/routes';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import styles from './index.module.css';

const fetchArchivedStandings = async (seasonId: number) => {
    const response = await apiClient.get(`/archive/seasons/${seasonId}/standings`);
    return response.data;
};

const fetchArchivedMatches = async (seasonId: number, division?: string) => {
    const params = division ? { division } : {};
    const response = await apiClient.get(`/archive/seasons/${seasonId}/matches`, { params });
    return response.data;
};

const ArchiveSeasonPage: React.FC = () => {
    const { seasonId } = useParams<{ seasonId: string }>();
    const [activeDivision, setActiveDivision] = useState('light');
    const [activeTab, setActiveTab] = useState<'standings' | 'matches'>('standings');

    const { data: standings, isLoading: standingsLoading, error: standingsError } = useQuery({
        queryKey: ['archiveStandings', seasonId],
        queryFn: () => fetchArchivedStandings(Number(seasonId)),
        enabled: !!seasonId,
    });

    const { data: matches, isLoading: matchesLoading, error: matchesError } = useQuery({
        queryKey: ['archiveMatches', seasonId, activeDivision],
        queryFn: () => fetchArchivedMatches(Number(seasonId), activeDivision),
        enabled: !!seasonId,
    });

    if (!seasonId) return null;

    const currentStandings = standings?.[activeDivision] || [];
    const currentMatches = matches || [];

    const isLoading = standingsLoading || matchesLoading;
    const hasError = standingsError || matchesError;

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    if (hasError) {
        return (
            <div className={styles.error}>
                <h2>Ошибка загрузки данных</h2>
                <p>Не удалось загрузить архивные данные</p>
                <Link to={ROUTES.ARCHIVE} className={styles.backLink}>
                    ← Вернуться к архиву
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to={ROUTES.ARCHIVE} className={styles.backLink}>
                    ← Назад к архиву
                </Link>
                <h1 className={styles.title}>Архив сезона #{seasonId}</h1>
            </div>

            <div className={styles.divisionNav}>
                {DIVISIONS.map((division) => (
                    <button
                        key={division.value}
                        className={`${styles.divisionButton} ${activeDivision === division.value ? styles.active : ''}`}
                        onClick={() => setActiveDivision(division.value)}
                    >
                        {division.label}
                    </button>
                ))}
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'standings' ? styles.active : ''}`}
                    onClick={() => setActiveTab('standings')}
                >
                    Турнирная таблица
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'matches' ? styles.active : ''}`}
                    onClick={() => setActiveTab('matches')}
                >
                    Результаты матчей
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'standings' && (
                    <StandingsTable standings={currentStandings} loading={false} />
                )}

                {activeTab === 'matches' && (
                    <div className={styles.matchesTable}>
                        {currentMatches.length === 0 ? (
                            <div className={styles.emptyMatches}>
                                <p>Нет результатов матчей для этого сезона</p>
                            </div>
                        ) : (
                            <table className={styles.matchTable}>
                                <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Команда хозяев</th>
                                    <th>Счёт</th>
                                    <th>Команда гостей</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentMatches.map((match: any, idx: number) => (
                                    <tr key={match.id || idx} className={styles.matchRow}>
                                        <td className={styles.matchDate}>
                                            {new Date(match.matchDate).toLocaleDateString('ru-RU')}
                                        </td>
                                        <td className={styles.homeTeam}>{match.homeTeamName}</td>
                                        <td className={styles.score}>
                                            <MatchResultTooltip
                                                result={`${match.homeSetsWon}:${match.awaySetsWon}`}
                                                sets={match.sets || []}
                                            >
                          <span className={styles.scoreValue}>
                            {match.homeSetsWon} : {match.awaySetsWon}
                          </span>
                                            </MatchResultTooltip>
                                        </td>
                                        <td className={styles.awayTeam}>{match.awayTeamName}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchiveSeasonPage;