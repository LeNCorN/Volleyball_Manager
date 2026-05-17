import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { Button, Select, Alert, Badge } from '@shared/ui';
import { LoadingSpinner } from '@shared/ui/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import styles from './index.module.css';

// API функции
const fetchMatches = async (division?: string) => {
    const params: any = {};
    if (division && division !== 'all') params.division = division;
    const response = await apiClient.get('/matches', { params });
    return response.data;
};

const fetchReferees = async () => {
    const response = await apiClient.get('/referees');
    return response.data;
};

const assignReferee = async (matchId: string, refereeId: string) => {
    const response = await apiClient.patch(`/admin/matches/${matchId}/referee`, { refereeId });
    return response.data;
};

const AdminMatchRefereePage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDivision, setSelectedDivision] = useState<string>('all');
    const [assignments, setAssignments] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data: matches, isLoading: matchesLoading } = useQuery({
        queryKey: ['matches', selectedDivision],
        queryFn: () => fetchMatches(selectedDivision === 'all' ? undefined : selectedDivision),
    });

    const { data: referees, isLoading: refereesLoading } = useQuery({
        queryKey: ['referees'],
        queryFn: fetchReferees,
    });

    const assignMutation = useMutation({
        mutationFn: ({ matchId, refereeId }: { matchId: string; refereeId: string }) =>
            assignReferee(matchId, refereeId),
        onSuccess: () => {
            setSuccessMessage('Судья успешно назначен на матч');
            setTimeout(() => setSuccessMessage(null), 3000);
            queryClient.invalidateQueries({ queryKey: ['matches'] });
        },
    });

    const handleAssign = (matchId: string, refereeId: string) => {
        if (!refereeId) return;
        assignMutation.mutate({ matchId, refereeId });
    };

    if (matchesLoading || refereesLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    const scheduledMatches = matches?.filter((m: any) => m.status === 'scheduled') || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Назначение судей на матчи</h1>
                <p className={styles.subtitle}>
                    Выберите судью для каждого запланированного матча
                </p>
            </div>

            {successMessage && <Alert type="success" message={successMessage} />}

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
            </div>

            <div className={styles.matchesTable}>
                {scheduledMatches.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Нет запланированных матчей для назначения судей</p>
                        <Button
                            variant="primary"
                            onClick={() => window.location.href = ROUTES.ADMIN_SCHEDULE_GENERATOR}
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
                            <th>Команда гостей</th>
                            <th>Назначенный судья</th>
                            <th>Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scheduledMatches.map((match: any) => (
                            <tr key={match.id} className={styles.row}>
                                <td>{new Date(match.date).toLocaleDateString('ru-RU')}</td>
                                <td>{match.time}</td>
                                <td>{match.division === 'light' ? '🏐 Лайт-лига' : '🔥 Хард-лига'}</td>
                                <td>{match.homeTeamName}</td>
                                <td>{match.awayTeamName}</td>
                                <td>
                                    {match.refereeName ? (
                                        <Badge variant="success">{match.refereeName}</Badge>
                                    ) : (
                                        <Badge variant="warning">Не назначен</Badge>
                                    )}
                                </td>
                                <td>
                                    <Select
                                        options={[
                                            { value: '', label: '-- Выберите судью --' },
                                            ...(referees || []).map((r: any) => ({ value: r.id, label: r.fullName })),
                                        ]}
                                        value={assignments[match.id] || match.refereeId || ''}
                                        onChange={(e) => {
                                            setAssignments({ ...assignments, [match.id]: e.target.value });
                                            handleAssign(match.id, e.target.value);
                                        }}
                                        className={styles.refereeSelect}
                                    />
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

export default AdminMatchRefereePage;