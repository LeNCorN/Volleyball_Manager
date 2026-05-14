import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchById } from '@entities/match';
import { ProtocolForm } from '@features/inputMatchProtocol/ui/ProtocolForm';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './index.module.css';

const AdminMatchProtocolPage: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const { data: match, isLoading } = useMatchById(matchId);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!match) {
        return (
            <div className={styles.notFound}>
                <h2>Матч не найден</h2>
                <button onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} className={styles.backBtn}>
                    ← Вернуться в админ-панель
                </button>
            </div>
        );
    }

    if (match.status === 'finished') {
        return (
            <div className={styles.alreadyFinished}>
                <h2>Матч уже завершён</h2>
                <p>Результаты матча: {match.homeSetsWon} : {match.awaySetsWon}</p>
                <button onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} className={styles.backBtn}>
                    ← Вернуться в админ-панель
                </button>
            </div>
        );
    }

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
                homePlayers={match.homeTeam?.players}
                awayPlayers={match.awayTeam?.players}
                refereeId={match.refereeId}
                onSuccess={() => {
                    alert('Протокол успешно сохранён!');
                    navigate(ROUTES.ADMIN_DASHBOARD);
                }}
            />
        </div>
    );
};

export default AdminMatchProtocolPage;