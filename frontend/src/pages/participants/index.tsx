import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import { Button } from '@shared/ui';
import styles from './index.module.css';

const ParticipantsPage: React.FC = () => {
    const navItems = [
        { path: ROUTES.PARTICIPANTS_PLAYERS, label: 'Игроки', icon: '👤' },
        { path: ROUTES.PARTICIPANTS_TEAMS, label: 'Команды', icon: '🏐' },
        { path: ROUTES.PARTICIPANTS_REFEREES, label: 'Судьи', icon: '⚖️' },
        { path: ROUTES.PARTICIPANTS_BEST_PLAYERS, label: 'Лучшие игроки', icon: '⭐' },
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
                <h1 className={styles.title}>Участники</h1>
                <p className={styles.subtitle}>Информация о всех участниках чемпионата</p>
            </div>

            <div className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

export default ParticipantsPage;