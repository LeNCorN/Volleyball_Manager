import React from 'react';
import { PlayersSearch } from '@features/searchPlayers/ui/PlayersSearch';
import styles from './players.module.css';

const PlayersPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <PlayersSearch />
        </div>
    );
};

export default PlayersPage;