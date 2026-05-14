import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import styles from './best-players.module.css';

const fetchMvpRanking = async () => {
    const response = await apiClient.get('/mvp/rankings');
    return response.data;
};

const BestPlayersPage: React.FC = () => {
    const { data: players, isLoading } = useQuery({
        queryKey: ['mvpRanking'],
        queryFn: fetchMvpRanking,
    });

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>🏆 Лучшие игроки (MVP)</h2>
                <p>Игроки, получившие наибольшее количество номинаций MVP</p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Место</th>
                        <th>ФИО игрока</th>
                        <th>Команда</th>
                        <th>Количество MVP</th>
                    </tr>
                    </thead>
                    <tbody>
                    {players?.map((player: any, idx: number) => (
                        <tr key={player.id}>
                            <td>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                            <td>{player.fullName}</td>
                            <td>{player.teamName}</td>
                            <td>{player.mvpCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BestPlayersPage;