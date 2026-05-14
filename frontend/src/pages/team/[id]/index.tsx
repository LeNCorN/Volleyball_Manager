import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeamById } from '@entities/team';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { ScheduleTable } from '@widgets/ScheduleTable/ScheduleTable';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './index.module.css';

const getPositionLabel = (position: string): string => {
    const labels: Record<string, string> = {
        attacker: 'Нападающий',
        setter: 'Связующий',
        libero: 'Либеро',
        blocker: 'Блокирующий',
    };
    return labels[position] || position;
};

const getSkillLevelLabel = (level: string): string => {
    const labels: Record<string, string> = {
        light: 'Лайт',
        light_plus: 'Лайт+',
        light_plus_plus: 'Лайт++',
        medium: 'Медиум',
        medium_plus: 'Медиум+',
        hard: 'Хард',
        hard_plus: 'Хард+',
    };
    return labels[level] || level;
};

const TeamDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: team, isLoading: teamLoading } = useTeamById(id);

    if (teamLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    if (!team) {
        return (
            <div className={styles.notFound}>
                <h2>Команда не найдена</h2>
                <Link to={ROUTES.PARTICIPANTS_TEAMS} className={styles.backLink}>
                    ← Вернуться к списку команд
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Шапка команды */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.emblem}>
                        {team.emblemUrl ? (
                            <img src={team.emblemUrl} alt={team.name} className={styles.emblemImage} />
                        ) : (
                            <div className={styles.emblemPlaceholder}>🏐</div>
                        )}
                    </div>
                    <div className={styles.info}>
                        <h1 className={styles.teamName}>{team.name}</h1>
                        <div className={styles.badges}>
              <span className={`${styles.badge} ${team.division === 'hard' ? styles.hard : styles.light}`}>
                {team.division === 'hard' ? 'Хард-лига' : 'Лайт-лига'}
              </span>
                            {team.groupLetter && (
                                <span className={styles.badgeGroup}>Группа {team.groupLetter}</span>
                            )}
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>Капитан</span>
                                <span className={styles.statValue}>{team.captainName}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>Средний рост</span>
                                <span className={styles.statValue}>{team.avgHeight} см</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statLabel}>Средний возраст</span>
                                <span className={styles.statValue}>{team.avgAge} лет</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Состав команды */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Состав команды</h2>
                <div className={styles.playersTable}>
                    <div className={styles.playersHeader}>
                        <span>ФИО</span>
                        <span>Рост</span>
                        <span>Возраст</span>
                        <span>Позиция</span>
                        <span>Уровень</span>
                    </div>
                    {team.players?.map((player: any) => (
                        <div key={player.id} className={styles.playerRow}>
                            <span className={styles.playerName}>{player.fullName}</span>
                            <span>{player.heightCm} см</span>
                            <span>{player.age} лет</span>
                            <span>{getPositionLabel(player.position)}</span>
                            <span className={styles.skillLevel}>{getSkillLevelLabel(player.skillLevel)}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Расписание команды */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Расписание матчей</h2>
                <ScheduleTable matches={team.schedule || []} loading={false} />
            </section>
        </div>
    );
};

export default TeamDetailsPage;