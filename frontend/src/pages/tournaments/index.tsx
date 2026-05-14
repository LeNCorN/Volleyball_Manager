import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StandingsTable } from '@widgets/StandingsTable/StandingsTable';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { ROUTES } from '@shared/lib/constants/routes';
import { Button } from '@shared/ui';
import styles from './index.module.css';

const fetchStandings = async (division: string) => {
    const response = await apiClient.get(`/standings/${division}`);
    return response.data;
};

const TournamentsPage: React.FC = () => {
    const [activeDivision, setActiveDivision] = useState('light');

    const { data: standings, isLoading } = useQuery({
        queryKey: ['standings', activeDivision],
        queryFn: () => fetchStandings(activeDivision),
    });

    const tabs = [
        { key: 'light', label: '🏐 Лайт-лига' },
        { key: 'hard', label: '🔥 Хард-лига' },
    ];

    return (
        <div className={styles.container}>
            {/* Кнопка "На главную" */}
            <div className={styles.homeButton}>
                <Link to={ROUTES.HOME}>
                    <Button variant="outline" size="sm">
                        ← На главную
                    </Button>
                </Link>
            </div>

            {/* Заголовок как на главной */}
            <div className={styles.header}>
                <h1 className={styles.title}>Турнирные таблицы</h1>
                <p className={styles.subtitle}>Актуальное положение команд в чемпионате</p>
            </div>

            <div className={styles.tabsWrapper}>
                <div className={styles.tabsHeader}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`${styles.tabButton} ${activeDivision === tab.key ? styles.active : ''}`}
                            onClick={() => setActiveDivision(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className={styles.tabContent}>
                    <StandingsTable standings={standings || []} loading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default TournamentsPage;