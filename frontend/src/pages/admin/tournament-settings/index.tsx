import React from 'react';
import { SettingsForm } from '@features/updateTournamentSettings/ui/SettingsForm';
import styles from './index.module.css';

const AdminTournamentSettingsPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Настройки турнира</h1>
                <p className={styles.subtitle}>
                    Управление датами, площадками и временем проведения матчей
                </p>
            </div>
            <SettingsForm />
        </div>
    );
};

export default AdminTournamentSettingsPage;