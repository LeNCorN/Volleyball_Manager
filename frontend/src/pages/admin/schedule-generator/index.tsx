import React, { useState } from 'react';
import { useTournamentSettings } from '@features/updateTournamentSettings/model/useTournamentSettings';
import { useGenerateSchedule, useClearSchedule } from '@features/generateSchedule/model/useGenerateSchedule';
import { Button, Alert, Card } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import styles from './index.module.css';

const ScheduleGeneratorPage: React.FC = () => {
    const { data: settings, isLoading: settingsLoading } = useTournamentSettings();
    const generateMutation = useGenerateSchedule();
    const clearMutation = useClearSchedule();
    const [overwrite, setOverwrite] = useState(false);

    const handleGenerate = () => {
        generateMutation.mutate({ overwrite });
    };

    const handleClear = () => {
        if (window.confirm('Вы уверены, что хотите очистить всё расписание?')) {
            clearMutation.mutate();
        }
    };

    if (settingsLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Генерация расписания</h1>
                <p className={styles.subtitle}>
                    Автоматическое создание расписания матчей на основе групп и настроек турнира
                </p>
            </div>

            <Card className={styles.settingsCard}>
                <h3 className={styles.sectionTitle}>Текущие настройки турнира</h3>
                <div className={styles.settingsGrid}>
                    <div className={styles.settingItem}>
                        <span className={styles.settingLabel}>Даты проведения:</span>
                        <span>
              {settings?.startDate && new Date(settings.startDate).toLocaleDateString('ru-RU')} —{' '}
                            {settings?.endDate && new Date(settings.endDate).toLocaleDateString('ru-RU')}
            </span>
                    </div>
                    <div className={styles.settingItem}>
                        <span className={styles.settingLabel}>Игровые дни:</span>
                        <span>
              {settings?.playDays?.map((d: string) => {
                  const days: Record<string, string> = {
                      monday: 'Пн', tuesday: 'Вт', wednesday: 'Ср',
                      thursday: 'Чт', friday: 'Пт', saturday: 'Сб', sunday: 'Вс'
                  };
                  return days[d];
              }).join(', ')}
            </span>
                    </div>
                    <div className={styles.settingItem}>
                        <span className={styles.settingLabel}>Площадок:</span>
                        <span>{settings?.courtsCount}</span>
                    </div>
                    <div className={styles.settingItem}>
                        <span className={styles.settingLabel}>Временные слоты:</span>
                        <span>{settings?.timeSlots?.join(', ')}</span>
                    </div>
                    <div className={styles.settingItem}>
                        <span className={styles.settingLabel}>Длительность матча:</span>
                        <span>{settings?.matchDurationMinutes} минут</span>
                    </div>
                </div>
            </Card>

            <Card className={styles.optionsCard}>
                <h3 className={styles.sectionTitle}>Опции генерации</h3>

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={overwrite}
                        onChange={(e) => setOverwrite(e.target.checked)}
                    />
                    Перезаписать существующее расписание
                </label>

                <div className={styles.warning}>
                    ⚠️ Генерация расписания может занять некоторое время в зависимости от количества команд.
                </div>
            </Card>

            <div className={styles.actions}>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerate}
                    loading={generateMutation.isPending}
                >
                    🎲 Сгенерировать расписание
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleClear}
                    loading={clearMutation.isPending}
                >
                    🗑️ Очистить расписание
                </Button>
            </div>

            {generateMutation.isSuccess && (
                <Alert
                    type="success"
                    message={`Расписание успешно сгенерировано! Создано ${generateMutation.data?.data?.matchesCount || 0} матчей.`}
                />
            )}

            {generateMutation.isError && (
                <Alert
                    type="error"
                    message={generateMutation.error?.message || 'Ошибка при генерации расписания'}
                />
            )}

            {clearMutation.isSuccess && (
                <Alert type="success" message="Расписание успешно очищено" />
            )}
        </div>
    );
};

export default ScheduleGeneratorPage;