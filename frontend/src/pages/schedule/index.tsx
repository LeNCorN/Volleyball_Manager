import React from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import { Button } from '@shared/ui';
import styles from './index.module.css';

const SchedulePage: React.FC = () => {
    const { league } = useParams<{ league: string }>();
    const activeLeague = league || 'light';

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
                <h1 className={styles.title}>Расписание игр</h1>
                <p className={styles.subtitle}>Календарь матчей чемпионата</p>
            </div>

            <div className={styles.leagueNav}>
                {DIVISIONS.map((division) => (
                    <Link
                        key={division.value}
                        to={ROUTES.SCHEDULE_BY_LEAGUE(division.value)}
                        className={`${styles.leagueLink} ${activeLeague === division.value ? styles.active : ''}`}
                    >
                        {division.label}
                    </Link>
                ))}
            </div>

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

export default SchedulePage;