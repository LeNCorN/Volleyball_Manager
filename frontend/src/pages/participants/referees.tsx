import React from 'react';
import { useRefereeRanking } from '@entities/referee';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import styles from './referees.module.css';

const RefereesPage: React.FC = () => {
    const { data: referees, isLoading } = useRefereeRanking();

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
                <h2>Рейтинг судей</h2>
                <p>Оценки работы судей от команд</p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Место</th>
                        <th>ФИО судьи</th>
                        <th>Матчей</th>
                        <th>⭐ 5</th>
                        <th>👍 4</th>
                        <th>😐 3</th>
                        <th>👎 2</th>
                        <th>Ср. оценка</th>
                        <th>Разных команд</th>
                        <th>Итоговый балл</th>
                    </tr>
                    </thead>
                    <tbody>
                    {referees?.map((referee: any, idx: number) => (
                        <tr key={referee.id}>
                            <td>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                            <td>{referee.fullName}</td>
                            <td>{referee.matchesCount}</td>
                            <td>{referee.score5}</td>
                            <td>{referee.score4}</td>
                            <td>{referee.score3}</td>
                            <td>{referee.score2}</td>
                            <td>{referee.averageScore}</td>
                            <td>{referee.uniqueTeamsCount}</td>
                            <td>{referee.finalScore}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RefereesPage;