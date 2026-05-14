import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './Dropdown.module.css';

export const TournamentDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={styles.dropdown}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className={styles.dropdownTrigger}>
                🏆 Турниры
            </button>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <Link to={ROUTES.TOURNAMENTS} className={styles.dropdownItem}>
                        Таблицы
                    </Link>
                </div>
            )}
        </div>
    );
};