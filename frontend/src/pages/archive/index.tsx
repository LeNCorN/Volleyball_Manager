import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAllSeasons } from '@entities/season';
import { Button, Select } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import styles from './index.module.css';

const ArchivePage: React.FC = () => {
    const navigate = useNavigate();
    const { data: seasons, isLoading } = useAllSeasons();
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');

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

    const activeSeasons = seasons?.filter((s: any) => !s.isActive) || [];

    return (
        <div className={styles.container}>
            {/* Кнопка "На главную" */}
            <div className={styles.homeButton}>
                <Link to={ROUTES.HOME}>
                    <Button variant="outline" size="sm">
                        ← На главную
                    </Button>
                </Link>
            </div>

            {/* Заголовок как на главной */}
            <div className={styles.header}>
                <h1 className={styles.title}>Архив сезонов</h1>
                <p className={styles.subtitle}>
                    Просмотр результатов прошлых чемпионатов
                </p>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>Выберите сезон</h3>

                {activeSeasons.length === 0 ? (
                    <p className={styles.emptyMessage}>Нет завершённых сезонов</p>
                ) : (
                    <>
                        <div className={styles.selectWrapper}>
                            <Select
                                options={[
                                    { value: '', label: '-- Выберите сезон --' },
                                    ...activeSeasons.map((season: any) => ({
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