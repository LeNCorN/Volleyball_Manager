import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './StandingsTable.module.css';

interface StandingRow {
    place: number;
    teamId: string;
    teamName: string;
    matchesPlayed: number;
    wins: number;
    losses: number;
    setsWon: number;
    setsLost: number;
    setsDifference: number;
    pointsFor: number;
    pointsAgainst: number;
    pointsDifference: number;
    tournamentPoints: number;
}

interface StandingsTableProps {
    standings: StandingRow[];
    loading?: boolean;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, loading }) => {
    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (!standings.length) {
        return <div className={styles.empty}>Нет данных для отображения</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.th}>Место</th>
                    <th className={styles.th}>Команда</th>
                    <th className={styles.th}>Игры</th>
                    <th className={styles.th}>Победы</th>
                    <th className={styles.th}>Поражения</th>
                    <th className={styles.th}>Сеты (+/-)</th>
                    <th className={styles.th}>Очки (+/-)</th>
                    <th className={styles.th}>Турнирные очки</th>
                </tr>
                </thead>
                <tbody>
                {standings.map((team) => {
                    const medal = team.place === 1 ? '🥇' : team.place === 2 ? '🥈' : team.place === 3 ? '🥉' : null;

                    return (
                        <tr key={team.teamId} className={styles.tr}>
                            <td className={styles.td}>
                                {medal ? `${medal} ${team.place}` : team.place}
                            </td>
                            <td className={styles.td}>
                                <Link to={ROUTES.TEAM_DETAILS(team.teamId)} className={styles.teamLink}>
                                    {team.teamName}
                                </Link>
                            </td>
                            <td className={styles.td}>{team.matchesPlayed}</td>
                            <td className={styles.td}>{team.wins}</td>
                            <td className={styles.td}>{team.losses}</td>
                            <td className={styles.td}>
                                {team.setsWon} : {team.setsLost} ({team.setsDifference > 0 ? '+' : ''}{team.setsDifference})
                            </td>
                            <td className={styles.td}>
                                {team.pointsFor} : {team.pointsAgainst} ({team.pointsDifference > 0 ? '+' : ''}{team.pointsDifference})
                            </td>
                            <td className={`${styles.td} ${styles.points}`}>{team.tournamentPoints}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};