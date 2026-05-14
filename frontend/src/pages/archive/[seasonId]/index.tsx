import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { StandingsTable } from '@widgets/StandingsTable/StandingsTable';
import { ScheduleTable } from '@widgets/ScheduleTable/ScheduleTable';
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

    const { data: standings, isLoading: standingsLoading } = useQuery({
        queryKey: ['archiveStandings', seasonId],
        queryFn: () => fetchArchivedStandings(Number(seasonId)),
    });

    const { data: matches, isLoading: matchesLoading } = useQuery({
        queryKey: ['archiveMatches', seasonId, activeDivision],
        queryFn: () => fetchArchivedMatches(Number(seasonId), activeDivision),
    });

    if (!seasonId) return null;

    const currentStandings = standings?.[activeDivision] || [];

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
                    <StandingsTable standings={currentStandings} loading={standingsLoading} />
                )}
                {activeTab === 'matches' && (
                    <ScheduleTable matches={matches || []} loading={matchesLoading} />
                )}
            </div>
        </div>
    );
};

export default ArchiveSeasonPage;