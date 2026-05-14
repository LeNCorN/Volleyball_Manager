import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminNavItem.module.css';

interface AdminNavItemProps {
    path: string;
    icon: string;
    label: string;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({ path, icon, label }) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
            }
        >
            <span className={styles.icon}>{icon}</span>
            <span>{label}</span>
        </NavLink>
    );
};