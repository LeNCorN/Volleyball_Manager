import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { ROUTES } from '@shared/lib/constants/routes';
import { Button } from '@shared/ui';
import styles from './index.module.css';

// Функция для получения данных турнирной таблицы
const fetchStandings = async (division: string) => {
    try {
        const response = await apiClient.get(`/standings/${division}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching standings:', error);
        return [];
    }
};

const HomePage: React.FC = () => {
    // Получаем реальные данные для Лайт-лиги
    const { data: lightStandings, isLoading: lightLoading } = useQuery({
        queryKey: ['standings', 'light'],
        queryFn: () => fetchStandings('light'),
        staleTime: 5 * 60 * 1000,
    });

    // Получаем реальные данные для Хард-лиги
    const { data: hardStandings, isLoading: hardLoading } = useQuery({
        queryKey: ['standings', 'hard'],
        queryFn: () => fetchStandings('hard'),
        staleTime: 5 * 60 * 1000,
    });

    // Берём топ-3 команды из Лайт-лиги
    const topLightTeams = lightStandings?.slice(0, 3) || [];
    const topHardTeams = hardStandings?.slice(0, 3) || [];

    return (
        <div className={styles.container}>
            {/* Hero секция */}
            <section className={styles.hero}>
                <h1 className={styles.title}>Волейбольный чемпионат</h1>
                <p className={styles.subtitle}>
                    Турнирные таблицы, расписание и рейтинги
                </p>
                <div className={styles.heroButtons}>
                    <Link to={ROUTES.TOURNAMENTS}>
                        <Button variant="primary" size="lg">
                            Турниры
                        </Button>
                    </Link>
                    <Link to={ROUTES.APPLY}>
                        <Button variant="outline" size="lg">
                            Заявка
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Быстрый доступ - обновлённый */}
            <section className={styles.quickAccess}>
                <h2 className={styles.sectionTitle}>Быстрый доступ</h2>
                <div className={styles.quickGrid}>
                    {/* Таблицы */}
                    <Link to={ROUTES.TOURNAMENTS} className={styles.quickCard}>
                        <div className={styles.quickIcon}>🏆</div>
                        <span>Таблицы</span>
                    </Link>

                    {/* Расписание */}
                    <Link to={ROUTES.SCHEDULE_BY_LEAGUE('light')} className={styles.quickCard}>
                        <div className={styles.quickIcon}>📅</div>
                        <span>Расписание</span>
                    </Link>

                    {/* Участники (вместо Игроки) */}
                    <Link to={ROUTES.PARTICIPANTS} className={styles.quickCard}>
                        <div className={styles.quickIcon}>👥</div>
                        <span>Участники</span>
                    </Link>

                    {/* Документы */}
                    <Link to={ROUTES.DOCUMENTS} className={styles.quickCard}>
                        <div className={styles.quickIcon}>📄</div>
                        <span>Документы</span>
                    </Link>

                    {/* Архив */}
                    <Link to={ROUTES.ARCHIVE} className={styles.quickCard}>
                        <div className={styles.quickIcon}>📦</div>
                        <span>Архив</span>
                    </Link>

                    {/* Подать заявку */}
                    <Link to={ROUTES.APPLY} className={styles.quickCard}>
                        <div className={styles.quickIcon}>📝</div>
                        <span>Заявка</span>
                    </Link>
                </div>
            </section>

            {/* Лайт-лига - топ 3 */}
            <section className={styles.preview}>
                <div className={styles.previewHeader}>
                    <h2 className={styles.sectionTitle}>🏐 Лайт-лига</h2>
                    <Link to={ROUTES.TOURNAMENTS} className={styles.previewLink}>
                        Все турниры →
                    </Link>
                </div>
                <div className={styles.previewTable}>
                    {lightLoading ? (
                        <div className={styles.previewLoading}>Загрузка...</div>
                    ) : topLightTeams.length === 0 ? (
                        <div className={styles.previewEmpty}>Нет данных</div>
                    ) : (
                        topLightTeams.map((team: any, idx: number) => (
                            <div key={team.teamId} className={styles.previewRow}>
                                <span>{idx + 1}. {team.teamName}</span>
                                <span className={styles.previewPoints}>{team.tournamentPoints} очк{getPointsEnding(team.tournamentPoints)}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Хард-лига - топ 3 */}
            <section className={styles.preview}>
                <div className={styles.previewHeader}>
                    <h2 className={styles.sectionTitle}>🔥 Хард-лига</h2>
                    <Link to={ROUTES.TOURNAMENTS} className={styles.previewLink}>
                        Все турниры →
                    </Link>
                </div>
                <div className={styles.previewTable}>
                    {hardLoading ? (
                        <div className={styles.previewLoading}>Загрузка...</div>
                    ) : topHardTeams.length === 0 ? (
                        <div className={styles.previewEmpty}>Нет данных</div>
                    ) : (
                        topHardTeams.map((team: any, idx: number) => (
                            <div key={team.teamId} className={styles.previewRow}>
                                <span>{idx + 1}. {team.teamName}</span>
                                <span className={styles.previewPoints}>{team.tournamentPoints} очк{getPointsEnding(team.tournamentPoints)}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

// Вспомогательная функция для склонения "очков"
function getPointsEnding(points: number): string {
    if (points % 10 === 1 && points % 100 !== 11) return 'о';
    if ([2, 3, 4].includes(points % 10) && ![12, 13, 14].includes(points % 100)) return 'а';
    return 'ов';
}

export default HomePage;