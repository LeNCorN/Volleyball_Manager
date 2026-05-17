import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { ProtocolForm } from '@features/inputMatchProtocol/ui/ProtocolForm';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './index.module.css';

const fetchMatch = async (matchId: string) => {
    const response = await apiClient.get(`/matches/${matchId}`);
    return response.data;
};

const AdminMatchProtocolPage: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();

    console.log('Match ID from params:', matchId);

    const { data: match, isLoading, error } = useQuery({
        queryKey: ['match', matchId],
        queryFn: () => fetchMatch(matchId!),
        enabled: !!matchId,
    });

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.notFound}>
                <h2>Ошибка загрузки матча</h2>
                <p>{(error as any).message}</p>
                <button onClick={() => navigate(ROUTES.ADMIN_MATCH_PROTOCOL_LIST)} className={styles.backBtn}>
                    ← Вернуться к списку матчей
                </button>
            </div>
        );
    }

    if (!match) {
        return (
            <div className={styles.notFound}>
                <h2>Матч не найден</h2>
                <p>ID матча: {matchId}</p>
                <button onClick={() => navigate(ROUTES.ADMIN_MATCH_PROTOCOL_LIST)} className={styles.backBtn}>
                    ← Вернуться к списку матчей
                </button>
            </div>
        );
    }

    if (match.status === 'finished') {
        return (
            <div className={styles.alreadyFinished}>
                <h2>Матч уже завершён</h2>
                <p>Результаты матча: {match.homeSetsWon} : {match.awaySetsWon}</p>
                <button onClick={() => navigate(ROUTES.ADMIN_MATCH_PROTOCOL_LIST)} className={styles.backBtn}>
                    ← Вернуться к списку матчей
                </button>
            </div>
        );
    }

    // Логируем игроков для отладки
    console.log('Home players:', match.homePlayers);
    console.log('Away players:', match.awayPlayers);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Ввод протокола матча</h1>
                <p className={styles.subtitle}>
                    {match.homeTeamName} vs {match.awayTeamName}
                </p>
            </div>

            <ProtocolForm
                matchId={match.id}
                homeTeamId={match.homeTeamId}
                awayTeamId={match.awayTeamId}
                homeTeamName={match.homeTeamName}
                awayTeamName={match.awayTeamName}
                homePlayers={match.homePlayers || []}
                awayPlayers={match.awayPlayers || []}
                refereeId={match.refereeId}
                onSuccess={() => {
                    alert('Протокол успешно сохранён!');
                    navigate(ROUTES.ADMIN_MATCH_PROTOCOL_LIST);
                }}
            />
        </div>
    );
};

export default AdminMatchProtocolPage;