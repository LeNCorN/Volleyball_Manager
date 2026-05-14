import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import { TournamentDropdown } from './TournamentDropdown';
import { ScheduleDropdown } from './ScheduleDropdown';
import { ParticipantsDropdown } from './ParticipantsDropdown';
import styles from './TopNavbar.module.css';

export const TopNavbar: React.FC = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    if (isAdminPage) {
        return null;
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to={ROUTES.HOME} className={styles.logo}>
                    🏐 Чемпионат
                </Link>

                <div className={styles.navLinks}>
                    <TournamentDropdown />
                    <ScheduleDropdown />
                    <ParticipantsDropdown />

                    <Link to={ROUTES.DOCUMENTS} className={styles.navLink}>
                        📄 Документы
                    </Link>

                    <Link to={ROUTES.ARCHIVE} className={styles.navLink}>
                        📦 Архив
                    </Link>

                    <Link to={ROUTES.APPLY} className={styles.applyButton}>
                        Подать заявку
                    </Link>
                </div>
            </div>
        </nav>
    );
};