import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './Dropdown.module.css';

export const ParticipantsDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={styles.dropdown}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className={styles.dropdownTrigger}>
                👥 Участники
            </button>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <Link to={ROUTES.PARTICIPANTS_PLAYERS} className={styles.dropdownItem}>
                        Игроки
                    </Link>
                    <Link to={ROUTES.PARTICIPANTS_TEAMS} className={styles.dropdownItem}>
                        Команды
                    </Link>
                    <Link to={ROUTES.PARTICIPANTS_REFEREES} className={styles.dropdownItem}>
                        Судьи
                    </Link>
                    <Link to={ROUTES.PARTICIPANTS_BEST_PLAYERS} className={styles.dropdownItem}>
                        Лучшие игроки
                    </Link>
                </div>
            )}
        </div>
    );
};