import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { Button, Select } from '@shared/ui';
import { LoadingSpinner } from '@shared/ui/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './index.module.css';

const fetchArchivedSeasons = async () => {
    const response = await apiClient.get('/archive/seasons');
    return response.data;
};

const ArchivePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');

    const { data: seasons, isLoading, error } = useQuery({
        queryKey: ['archivedSeasons'],
        queryFn: fetchArchivedSeasons,
    });

    const handleViewSeason = () => {
        if (selectedSeasonId) {
            navigate(ROUTES.ARCHIVE_SEASON(selectedSeasonId));
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
                <p>Ошибка загрузки архивных сезонов</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                    Повторить
                </Button>
            </div>
        );
    }

    const archivedSeasons = seasons || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Архив сезонов</h1>
                <p className={styles.subtitle}>
                    Просмотр результатов прошлых чемпионатов
                </p>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Выберите сезон</h3>

                {archivedSeasons.length === 0 ? (
                    <div className={styles.emptyMessage}>
                        <p>Нет завершённых сезонов</p>
                        <p className={styles.emptyHint}>
                            Завершите текущий сезон в админ-панели, чтобы он появился в архиве
                        </p>
                    </div>
                ) : (
                    <>
                        <div className={styles.selectWrapper}>
                            <Select
                                options={[
                                    { value: '', label: '-- Выберите сезон --' },
                                    ...archivedSeasons.map((season: any) => ({
                                        value: season.id.toString(),
                                        label: season.name,
                                    })),
                                ]}
                                value={selectedSeasonId}
                                onChange={(e) => setSelectedSeasonId(e.target.value)}
                                fullWidth
                            />
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleViewSeason}
                            disabled={!selectedSeasonId}
                            fullWidth
                        >
                            Показать результаты
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ArchivePage;