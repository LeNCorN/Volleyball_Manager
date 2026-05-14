import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Alert } from '@shared/ui';
import { useTournamentSettings, useUpdateTournamentSettings, useValidateSettings } from '../model/useTournamentSettings';
import { TournamentSettingsDto } from '../api/settingsApi';
import styles from './SettingsForm.module.css';

const DAYS_OF_WEEK = [
    { value: 'monday', label: 'Понедельник' },
    { value: 'tuesday', label: 'Вторник' },
    { value: 'wednesday', label: 'Среда' },
    { value: 'thursday', label: 'Четверг' },
    { value: 'friday', label: 'Пятница' },
    { value: 'saturday', label: 'Суббота' },
    { value: 'sunday', label: 'Воскресенье' },
];

export const SettingsForm: React.FC = () => {
    const { data: settings, isLoading } = useTournamentSettings();
    const updateMutation = useUpdateTournamentSettings();
    const { refetch: validateSettings } = useValidateSettings();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TournamentSettingsDto>();

    useEffect(() => {
        if (settings) {
            reset({
                name: settings.name,
                startDate: settings.startDate?.split('T')[0],
                endDate: settings.endDate?.split('T')[0],
                playDays: settings.playDays,
                courtsCount: settings.courtsCount,
                courtsNames: settings.courtsNames?.join(', '),
                matchDurationMinutes: settings.matchDurationMinutes,
                dayStartTime: settings.dayStartTime,
                dayEndTime: settings.dayEndTime,
            });
        }
    }, [settings, reset]);

    const onSubmit = (data: TournamentSettingsDto) => {
        const formattedData: TournamentSettingsDto = {
            ...data,
            courtsNames: typeof data.courtsNames === 'string' && data.courtsNames
                ? data.courtsNames.split(',').map((s: string) => s.trim())
                : undefined,
        };
        updateMutation.mutate(formattedData);
    };

    const handleValidate = async () => {
        const result = await validateSettings();
        if (result.data?.isValid) {
            alert('Настройки корректны');
        } else {
            alert(`Ошибки: ${result.data?.errors?.join(', ')}`);
        }
    };

    if (isLoading) return <div className={styles.loading}>Загрузка...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.section}>
                <h3>Основные настройки</h3>

                <Input
                    label="Название турнира"
                    error={errors.name?.message}
                    {...register('name')}
                    fullWidth
                />

                <div className={styles.row}>
                    <Input
                        label="Дата начала"
                        type="date"
                        error={errors.startDate?.message}
                        {...register('startDate', { required: 'Дата начала обязательна' })}
                        fullWidth
                    />
                    <Input
                        label="Дата окончания"
                        type="date"
                        error={errors.endDate?.message}
                        {...register('endDate', { required: 'Дата окончания обязательна' })}
                        fullWidth
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h3>Игровые дни</h3>
                <div className={styles.checkboxGroup}>
                    {DAYS_OF_WEEK.map((day) => (
                        <label key={day.value} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                value={day.value}
                                {...register('playDays')}
                            />
                            {day.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3>Площадки</h3>

                <Input
                    label="Количество площадок"
                    type="number"
                    error={errors.courtsCount?.message}
                    {...register('courtsCount', { valueAsNumber: true, min: 1 })}
                    fullWidth
                />

                <Input
                    label="Названия площадок (через запятую)"
                    placeholder="Площадка 1, Площадка 2, Площадка 3"
                    error={errors.courtsNames?.message}
                    {...register('courtsNames')}
                    fullWidth
                />
            </div>

            <div className={styles.section}>
                <h3>Время</h3>

                <div className={styles.row}>
                    <Input
                        label="Начало игрового дня"
                        type="time"
                        error={errors.dayStartTime?.message}
                        {...register('dayStartTime')}
                        fullWidth
                    />
                    <Input
                        label="Конец игрового дня"
                        type="time"
                        error={errors.dayEndTime?.message}
                        {...register('dayEndTime')}
                        fullWidth
                    />
                </div>

                <Input
                    label="Длительность матча (минут)"
                    type="number"
                    error={errors.matchDurationMinutes?.message}
                    {...register('matchDurationMinutes', { valueAsNumber: true, min: 30, max: 180 })}
                    fullWidth
                />
            </div>

            {updateMutation.isError && (
                <Alert type="error" message="Ошибка при сохранении настроек" />
            )}

            {updateMutation.isSuccess && (
                <Alert type="success" message="Настройки успешно сохранены" />
            )}

            <div className={styles.buttons}>
                <Button type="button" variant="outline" onClick={handleValidate}>
                    Проверить настройки
                </Button>
                <Button type="submit" variant="primary" loading={updateMutation.isPending}>
                    Сохранить настройки
                </Button>
            </div>
        </form>
    );
};