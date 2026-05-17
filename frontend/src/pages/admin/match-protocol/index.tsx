import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { Button, Select, Badge } from '@shared/ui';
import { LoadingSpinner } from '@shared/ui/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import styles from './index.module.css';

const fetchMatches = async (division?: string, status?: string) => {
    const params: any = {};
    if (division && division !== 'all') params.division = division;
    if (status && status !== 'all') params.status = status;

    const response = await apiClient.get('/matches', { params });
    return response.data;
};

const AdminMatchProtocolListPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDivision, setSelectedDivision] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('scheduled');

    const { data: matches, isLoading, error, refetch } = useQuery({
        queryKey: ['adminMatches', selectedDivision, selectedStatus],
        queryFn: () => fetchMatches(
            selectedDivision === 'all' ? undefined : selectedDivision,
            selectedStatus === 'all' ? undefined : selectedStatus
        ),
    });

    const handleInputProtocol = (matchId: string) => {
        if (!matchId) {
            console.error('Match ID is undefined');
            return;
        }
        navigate(ROUTES.ADMIN_MATCH_PROTOCOL(matchId));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'scheduled':
                return <Badge variant="info">Запланирован</Badge>;
            case 'in_progress':
                return <Badge variant="warning">В процессе</Badge>;
            case 'finished':
                return <Badge variant="success">Завершён</Badge>;
            case 'forfeit':
                return <Badge variant="danger">Техническое поражение</Badge>;
            default:
                return <Badge variant="default">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>Ошибка загрузки матчей: {(error as any).message}</p>
                <Button variant="primary" onClick={() => refetch()}>Повторить</Button>
            </div>
        );
    }

    const hasMatches = matches && matches.length > 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Ввод протоколов матчей</h1>
                <p className={styles.subtitle}>
                    Выберите матч для ввода результатов, MVP и оценки судьи
                </p>
            </div>

            <div className={styles.filters}>
                <Select
                    label="Лига"
                    options={[
                        { value: 'all', label: 'Все лиги' },
                        ...DIVISIONS.map(d => ({ value: d.value, label: d.label })),
                    ]}
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className={styles.filterSelect}
                />

                <Select
                    label="Статус"
                    options={[
                        { value: 'scheduled', label: 'Запланированные' },
                        { value: 'in_progress', label: 'В процессе' },
                        { value: 'finished', label: 'Завершённые' },
                        { value: 'all', label: 'Все' },
                    ]}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={styles.filterSelect}
                />

                <Button variant="outline" onClick={() => refetch()} className={styles.refreshBtn}>
                    🔄 Обновить
                </Button>
            </div>

            <div className={styles.matchesTable}>
                {!hasMatches ? (
                    <div className={styles.empty}>
                        <p>Нет матчей для отображения</p>
                        <p className={styles.emptyHint}>
                            Сначала сформируйте группы и сгенерируйте расписание в админ-панели
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate(ROUTES.ADMIN_SCHEDULE_GENERATOR)}
                            className={styles.generateBtn}
                        >
                            🎲 Перейти к генерации расписания
                        </Button>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Лига</th>
                            <th>Команда хозяев</th>
                            <th>Счёт</th>
                            <th>Команда гостей</th>
                            <th>Статус</th>
                            <th>Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {matches.map((match: any) => (
                            <tr key={match.id} className={styles.row}>
                                <td>{match.matchDateFormatted || '—'}</td>
                                <td>{match.matchTime || '—'}</td>
                                <td>{match.divisionName || (match.division === 'light' ? '🏐 Лайт-лига' : '🔥 Хард-лига')}</td>
                                <td>{match.homeTeamName}</td>
                                <td className={styles.score}>
                                    {match.result ? match.result : <span className={styles.vs}>vs</span>}
                                </td>
                                <td>{match.awayTeamName}</td>
                                <td>{getStatusBadge(match.status)}</td>
                                <td>
                                    {match.status !== 'finished' && match.id ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleInputProtocol(match.id)}
                                        >
                                            📝 Ввести протокол
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>
                                            {match.status === 'finished' ? '✅ Завершён' : '❌ Нет ID'}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminMatchProtocolListPage;