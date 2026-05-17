// frontend/src/widgets/ScheduleTable/ScheduleTable.tsx

import React from 'react';
import { MatchResultTooltip } from '../MatchResultTooltip/MatchResultTooltip';
import styles from './ScheduleTable.module.css';

interface ScheduledMatch {
    id: string;
    division: string;
    group: string | null;
    homeTeam: string;
    awayTeam: string;
    date: Date;
    time: string;
    court: string;
    status: string;
    result: string | null;
    sets?: Array<{ homePoints: number; awayPoints: number }>;
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
                {matches.map((match) => (
                    <tr key={match.id} className={styles.tr}>
                        <td className={styles.td}>{new Date(match.date).toLocaleDateString('ru-RU')}</td>
                        <td className={styles.td}>{match.time}</td>
                        <td className={styles.td}>{match.court}</td>
                        <td className={styles.td}>{match.homeTeam}</td>
                        <td className={styles.td}>
                            {match.result ? (
                                <MatchResultTooltip result={match.result} sets={match.sets}>
                                    <span className={styles.result}>{match.result}</span>
                                </MatchResultTooltip>
                            ) : (
                                <span className={styles.vs}>vs</span>
                            )}
                        </td>
                        <td className={styles.td}>{match.awayTeam}</td>
                        <td className={styles.td}>
                <span className={`${styles.status} ${styles[match.status]}`}>
                  {match.status === 'scheduled' && '📅 Запланирован'}
                    {match.status === 'in_progress' && '🔄 В процессе'}
                    {match.status === 'finished' && '✅ Завершён'}
                    {match.status === 'forfeit' && '⚠️ Техническое поражение'}
                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};