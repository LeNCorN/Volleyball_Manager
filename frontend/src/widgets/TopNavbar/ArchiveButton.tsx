import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './Dropdown.module.css';

export const ArchiveButton: React.FC = () => {
    return (
        <Link to={ROUTES.ARCHIVE} className={styles.navLink}>
            📦 Архив
        </Link>
    );
};