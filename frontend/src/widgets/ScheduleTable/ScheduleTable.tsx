import React from 'react';
import { MatchResultTooltip } from '../MatchResultTooltip/MatchResultTooltip';
import styles from './ScheduleTable.module.css';

interface ScheduledMatch {
    id: string;
    division: string;
    group: string | null;
    homeTeam: string;
    awayTeam: string;
    date: Date | string;
    time?: string;
    court?: string;
    status: string;
    result: string | null;
    sets?: Array<{ homePoints: number; awayPoints: number }>;
    matchDateFormatted?: string;
    homeSetsWon?: number;
    awaySetsWon?: number;
}

interface ScheduleTableProps {
    matches: ScheduledMatch[];
    loading?: boolean;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ matches, loading }) => {
    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (!matches.length) {
        return <div className={styles.empty}>Нет данных для отображения</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.th}>Дата</th>
                    <th className={styles.th}>Время</th>
                    <th className={styles.th}>Площадка</th>
                    <th className={styles.th}>Команда хозяев</th>
                    <th className={styles.th}>Счёт</th>
                    <th className={styles.th}>Команда гостей</th>
                    <th className={styles.th}>Статус</th>
                </tr>
                </thead>
                <tbody>
                {matches.map((match) => {
                    // Определяем дату
                    const dateStr = match.matchDateFormatted
                        ? match.matchDateFormatted
                        : (match.date ? new Date(match.date).toLocaleDateString('ru-RU') : '—');

                    // Определяем время
                    const timeStr = match.time || '—';

                    // Определяем площадку
                    const courtStr = match.court || '—';

                    // Определяем результат
                    const isFinished = match.status === 'finished' || (match.homeSetsWon !== undefined && match.awaySetsWon !== undefined);
                    const displayResult = isFinished && match.result ? match.result :
                        (match.homeSetsWon !== undefined && match.awaySetsWon !== undefined)
                            ? `${match.homeSetsWon}:${match.awaySetsWon}`
                            : 'vs';

                    return (
                        <tr key={match.id} className={styles.tr}>
                            <td className={styles.td}>{dateStr}</td>
                            <td className={styles.td}>{timeStr}</td>
                            <td className={styles.td}>{courtStr}</td>
                            <td className={styles.td}>{match.homeTeam}</td>
                            <td className={styles.td}>
                                {isFinished && displayResult !== 'vs' ? (
                                    <MatchResultTooltip result={displayResult} sets={match.sets}>
                                        <span className={styles.result}>{displayResult}</span>
                                    </MatchResultTooltip>
                                ) : (
                                    <span className={styles.vs}>{displayResult}</span>
                                )}
                            </td>
                            <td className={styles.td}>{match.awayTeam}</td>
                            <td className={styles.td}>
                  <span className={`${styles.status} ${styles.finished}`}>
                    {match.status === 'finished' || isFinished ? '✅ Завершён' : '📅 Запланирован'}
                  </span>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};