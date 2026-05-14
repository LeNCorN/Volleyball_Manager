import React from 'react';
import { TeamsSearch } from '@features/searchTeams/ui/TeamsSearch';
import styles from './teams.module.css';

const TeamsPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <TeamsSearch />
        </div>
    );
};

export default TeamsPage;