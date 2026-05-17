import React, { useState } from 'react';
import { useAllSeasons, useCurrentSeason, useCreateSeason, useCloseSeason } from '@entities/season';
import { Button, Modal, Input, Alert, Badge } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import styles from './index.module.css';

const AdminSeasonPage: React.FC = () => {
    const { data: seasons, isLoading: seasonsLoading, refetch } = useAllSeasons();
    const { data: currentSeason, refetch: refetchCurrent } = useCurrentSeason();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [newSeason, setNewSeason] = useState({
        name: '',
        startDate: '',
        endDate: '',
        weeksCount: 10,
    });
    const [error, setError] = useState<string | null>(null);

    const createMutation = useCreateSeason();
    const closeMutation = useCloseSeason();

    const handleCreateSeason = () => {
        if (!newSeason.name || !newSeason.startDate || !newSeason.endDate) {
            setError('Заполните все обязательные поля');
            return;
        }

        createMutation.mutate(newSeason, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setNewSeason({ name: '', startDate: '', endDate: '', weeksCount: 10 });
                setError(null);
                refetch();
                refetchCurrent();
            },
            onError: (err: any) => {
                setError(err.response?.data?.message || 'Ошибка при создании сезона');
            },
        });
    };

    const handleCloseSeason = () => {
        closeMutation.mutate(true, {
            onSuccess: (data: any) => {
                setIsCloseModalOpen(false);
                refetch();
                refetchCurrent();

                if (data.data?.success === false) {
                    alert(data.data.message);
                } else if (data.data?.alreadyClosed) {
                    alert('Сезон уже был завершён ранее.');
                } else {
                    alert('Сезон успешно завершён и архивирован!');
                }
            },
            onError: (err: any) => {
                setError(err.response?.data?.message || 'Ошибка при закрытии сезона');
            },
        });
    };

    if (seasonsLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Управление сезонами</h1>
                <p className={styles.subtitle}>
                    Создание, активация и архивация сезонов
                </p>
            </div>

            <div className={styles.currentSeason}>
                <h2 className={styles.sectionTitle}>Текущий сезон</h2>
                {currentSeason ? (
                    <div className={styles.seasonCard}>
                        <div className={styles.seasonInfo}>
                            <span className={styles.seasonName}>{currentSeason.name}</span>
                            <Badge variant="success">Активен</Badge>
                        </div>
                        <div className={styles.seasonDates}>
                            {new Date(currentSeason.startDate).toLocaleDateString('ru-RU')} —{' '}
                            {new Date(currentSeason.endDate).toLocaleDateString('ru-RU')}
                        </div>
                        <div className={styles.seasonActions}>
                            <Button variant="danger" onClick={() => setIsCloseModalOpen(true)}>
                                📦 Завершить сезон
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.noSeason}>
                        <p>Нет активного сезона</p>
                        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                            + Создать сезон
                        </Button>
                    </div>
                )}
            </div>

            <div className={styles.seasonsHistory}>
                <h2 className={styles.sectionTitle}>История сезонов</h2>

                {seasons?.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Нет созданных сезонов</p>
                    </div>
                ) : (
                    <div className={styles.seasonsList}>
                        {seasons?.map((season: any) => (
                            <div key={season.id} className={styles.historyCard}>
                                <div className={styles.historyInfo}>
                                    <span className={styles.historyName}>{season.name}</span>
                                    {season.isActive && <Badge variant="success">Текущий</Badge>}
                                    {!season.isActive && <Badge variant="default">Завершён</Badge>}
                                </div>
                                <div className={styles.historyDates}>
                                    {new Date(season.startDate).toLocaleDateString('ru-RU')} —{' '}
                                    {new Date(season.endDate).toLocaleDateString('ru-RU')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setError(null);
                    setNewSeason({ name: '', startDate: '', endDate: '', weeksCount: 10 });
                }}
                title="Создание нового сезона"
            >
                <div className={styles.modalContent}>
                    {error && <Alert type="error" message={error} />}

                    <Input
                        label="Название сезона"
                        placeholder="Сезон 2026"
                        value={newSeason.name}
                        onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
                        fullWidth
                    />

                    <div className={styles.dateRow}>
                        <Input
                            label="Дата начала"
                            type="date"
                            value={newSeason.startDate}
                            onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
                            fullWidth
                        />
                        <Input
                            label="Дата окончания"
                            type="date"
                            value={newSeason.endDate}
                            onChange={(e) => setNewSeason({ ...newSeason, endDate: e.target.value })}
                            fullWidth
                        />
                    </div>

                    <Input
                        label="Количество недель"
                        type="number"
                        value={newSeason.weeksCount}
                        onChange={(e) => setNewSeason({ ...newSeason, weeksCount: parseInt(e.target.value) })}
                        fullWidth
                    />

                    <div className={styles.modalActions}>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateSeason}
                            loading={createMutation.isPending}
                        >
                            Создать
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isCloseModalOpen}
                onClose={() => {
                    setIsCloseModalOpen(false);
                    setError(null);
                }}
                title="Завершение сезона"
            >
                <div className={styles.modalContent}>
                    <p>Вы уверены, что хотите завершить сезон <strong>{currentSeason?.name}</strong>?</p>
                    <p className={styles.warning}>
                        Все результаты будут архивированы, после чего нельзя будет вносить изменения.
                    </p>

                    {error && <Alert type="error" message={error} />}

                    <div className={styles.modalActions}>
                        <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleCloseSeason}
                            loading={closeMutation.isPending}
                        >
                            Завершить сезон
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminSeasonPage;