import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import styles from './Dropdown.module.css';

export const ScheduleDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={styles.dropdown}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className={styles.dropdownTrigger}>
                📅 Расписание
            </button>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {DIVISIONS.map((division) => (
                        <Link
                            key={division.value}
                            to={ROUTES.SCHEDULE_BY_LEAGUE(division.value)}
                            className={styles.dropdownItem}
                        >
                            {division.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};