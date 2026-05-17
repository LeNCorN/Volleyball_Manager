import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeasonStatus } from '@entities/season';
import { useApplications } from '@entities/application';
import { useWaitingList } from '@features/manageWaitingList/model/useWaitingList';
import { Card } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './index.module.css';

const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: seasonStatus, isLoading: seasonLoading } = useSeasonStatus();
    const { data: applications, isLoading: appsLoading } = useApplications('pending');
    const { data: waitingList, isLoading: waitingLoading } = useWaitingList();

    const pendingCount = applications?.length || 0;
    const waitingCount = waitingList?.length || 0;

    const menuItems = [
        { path: ROUTES.ADMIN_APPLICATIONS, icon: '📋', label: 'Заявки', badge: pendingCount, color: '#3b82f6' },
        { path: ROUTES.ADMIN_WAITING_LIST, icon: '⏳', label: 'Лист ожидания', badge: waitingCount, color: '#f59e0b' },
        { path: ROUTES.ADMIN_TOURNAMENT_SETTINGS, icon: '⚙️', label: 'Настройки турнира', color: '#64748b' },
        { path: ROUTES.ADMIN_SCHEDULE_GENERATOR, icon: '🎲', label: 'Генерация расписания', color: '#8b5cf6' },
        { path: ROUTES.ADMIN_MATCH_PROTOCOL_LIST, icon: '📝', label: 'Ввод протоколов', color: '#10b981' },
        { path: ROUTES.ADMIN_PLAYERS, icon: '⭐', label: 'Управление игроками', color: '#ef4444' },
        { path: ROUTES.ADMIN_DOCUMENTS, icon: '📄', label: 'Управление документами', color: '#06b6d4' },
        { path: ROUTES.ADMIN_SEASON, icon: '📅', label: 'Управление сезонами', color: '#8b5cf6' },
        { path: ROUTES.ADMIN_REFEREES, icon: '⚖️', label: 'Управление судьями', color: '#8b5cf6' },
        { path: ROUTES.ADMIN_MATCH_REFEREE, icon: '👨‍⚖️', label: 'Назначение судей', color: '#f59e0b' },
    ];

    if (seasonLoading || appsLoading || waitingLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Панель управления</h1>
                <p className={styles.subtitle}>Добро пожаловать в админ-панель</p>
            </div>

            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>📋</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{pendingCount}</span>
                        <span className={styles.statLabel}>Новых заявок</span>
                    </div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{waitingCount}</span>
                        <span className={styles.statLabel}>В листе ожидания</span>
                    </div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>🏆</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{seasonStatus?.stats?.teamsCount || 0}</span>
                        <span className={styles.statLabel}>Команд</span>
                    </div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>📅</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{seasonStatus?.stats?.completionPercentage || 0}%</span>
                        <span className={styles.statLabel}>Завершённость</span>
                    </div>
                </Card>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Быстрые действия</h2>
                <div className={styles.actionsGrid}>
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className={styles.actionCard}
                            onClick={() => navigate(item.path)}
                        >
                            <div className={styles.actionIcon} style={{ background: item.color }}>
                                {item.icon}
                            </div>
                            <div className={styles.actionInfo}>
                                <span className={styles.actionLabel}>{item.label}</span>
                                {item.badge > 0 && (
                                    <span className={styles.actionBadge}>{item.badge}</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Текущий сезон</h2>
                <Card className={styles.seasonCard}>
                    <div className={styles.seasonInfo}>
                        <div>
                            <div className={styles.seasonName}>{seasonStatus?.season?.name || 'Не активен'}</div>
                            <div className={styles.seasonDates}>
                                {seasonStatus?.season?.startDate && new Date(seasonStatus.season.startDate).toLocaleDateString('ru-RU')} —{' '}
                                {seasonStatus?.season?.endDate && new Date(seasonStatus.season.endDate).toLocaleDateString('ru-RU')}
                            </div>
                        </div>
                        <div className={styles.seasonProgress}>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${seasonStatus?.stats?.completionPercentage || 0}%` }}
                                />
                            </div>
                            <span className={styles.progressText}>
                {seasonStatus?.stats?.finishedMatchesCount || 0} / {seasonStatus?.stats?.matchesCount || 0} матчей
              </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboardPage;