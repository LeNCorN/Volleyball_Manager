import React, { useState } from 'react';
import { useWaitingList } from '@features/manageWaitingList/model/useWaitingList';
import { Button, Modal, Alert, Badge } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { apiClient } from '@shared/api/client';
import styles from './index.module.css';

const WaitingListPage: React.FC = () => {
    const { data: waitingList, isLoading, refetch } = useWaitingList();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState<string>('light');
    const [groupsCount, setGroupsCount] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfigureGroups = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            await apiClient.post(`/admin/groups/${selectedDivision}`, { groupsCount });
            setIsModalOpen(false);
            refetch();
            alert('Группы успешно сформированы!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при формировании групп');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    const lightTeams = waitingList?.filter((t: any) => t.division?.name === 'light') || [];
    const hardTeams = waitingList?.filter((t: any) => t.division?.name === 'hard') || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Лист ожидания</h1>
                <p className={styles.subtitle}>
                    Команды, ожидающие распределения по группам
                </p>
            </div>

            {waitingList?.length === 0 ? (
                <div className={styles.empty}>
                    <p>Нет команд в листе ожидания</p>
                </div>
            ) : (
                <>
                    <div className={styles.divisionSection}>
                        <h2 className={styles.divisionTitle}>🏐 Лайт-лига</h2>
                        {lightTeams.length === 0 ? (
                            <p className={styles.divisionEmpty}>Нет команд</p>
                        ) : (
                            <div className={styles.teamsList}>
                                {lightTeams.map((team: any) => (
                                    <div key={team.id} className={styles.teamCard}>
                                        <span className={styles.teamName}>{team.name}</span>
                                        <Badge variant="info">Капитан: {team.captainName}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.divisionSection}>
                        <h2 className={styles.divisionTitle}>🔥 Хард-лига</h2>
                        {hardTeams.length === 0 ? (
                            <p className={styles.divisionEmpty}>Нет команд</p>
                        ) : (
                            <div className={styles.teamsList}>
                                {hardTeams.map((team: any) => (
                                    <div key={team.id} className={styles.teamCard}>
                                        <span className={styles.teamName}>{team.name}</span>
                                        <Badge variant="info">Капитан: {team.captainName}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
                            🏆 Сформировать группы
                        </Button>
                    </div>
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setError(null);
                }}
                title="Формирование групп"
            >
                <div className={styles.modalContent}>
                    <p>Выберите лигу для формирования групп:</p>

                    <div className={styles.divisionSelect}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value="light"
                                checked={selectedDivision === 'light'}
                                onChange={(e) => setSelectedDivision(e.target.value)}
                            />
                            Лайт-лига ({lightTeams.length} команд)
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value="hard"
                                checked={selectedDivision === 'hard'}
                                onChange={(e) => setSelectedDivision(e.target.value)}
                            />
                            Хард-лига ({hardTeams.length} команд)
                        </label>
                    </div>

                    <div className={styles.groupsCount}>
                        <label>Количество групп:</label>
                        <select
                            value={groupsCount}
                            onChange={(e) => setGroupsCount(Number(e.target.value))}
                            className={styles.select}
                        >
                            <option value={1}>1 группа</option>
                            <option value={2}>2 группы</option>
                        </select>
                    </div>

                    {error && <Alert type="error" message={error} />}

                    <div className={styles.modalActions}>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfigureGroups}
                            loading={isSubmitting}
                        >
                            Сформировать
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WaitingListPage;