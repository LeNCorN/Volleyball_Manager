import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, Input, Select, Alert } from '@shared/ui';
import { PlayerRowInput } from './PlayerRowInput';
import { useCreateApplication } from '../model/useCreateApplication';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import { validateTeamName, validatePhone, validateEmail } from '../lib/validation';
import styles from './ApplyForm.module.css';

interface PlayerForm {
    fullName: string;
    birthDate: string;
    heightCm: number;
    position: string;
    skillLevel: string;
}

interface FormData {
    teamName: string;
    division: string;
    captainName: string;
    captainPhone: string;
    captainEmail: string;
    players: PlayerForm[];
}

export const ApplyForm: React.FC = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const createApplication = useCreateApplication();

    const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        defaultValues: {
            division: 'light',
            players: [
                {
                    fullName: '',
                    birthDate: '',
                    heightCm: 0,
                    position: 'attacker',
                    skillLevel: 'light'
                }
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'players',
    });

    const handlePlayerChange = (index: number, field: keyof PlayerForm, value: string | number) => {
        setValue(`players.${index}.${field}`, value as any, { shouldValidate: true });
    };

    const addPlayer = () => {
        if (fields.length < 14) {
            append({
                fullName: '',
                birthDate: '',
                heightCm: 0,
                position: 'attacker',
                skillLevel: 'light'
            });
        }
    };

    const removePlayer = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const onSubmit = async (data: FormData) => {
        setServerError(null);
        try {
            await createApplication.mutateAsync(data);
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Ошибка при отправке заявки');
        }
    };

    // Получаем текущие значения игроков для передачи в PlayerRowInput
    const playersValues = watch('players');

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Подача заявки на участие</h1>
                <p className={styles.subtitle}>Заполните форму для регистрации команды</p>

                {serverError && (
                    <Alert type="error" message={serverError} />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Информация о команде</h2>

                        <Input
                            label="Название команды"
                            placeholder="Введите название команды"
                            error={errors.teamName?.message}
                            {...register('teamName', {
                                required: 'Название команды обязательно',
                                validate: validateTeamName,
                            })}
                            fullWidth
                        />

                        <Select
                            label="Лига"
                            options={DIVISIONS.map(d => ({ value: d.value, label: d.label }))}
                            error={errors.division?.message}
                            {...register('division')}
                            fullWidth
                        />
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Информация о капитане</h2>

                        <Input
                            label="ФИО капитана"
                            placeholder="Иванов Иван Иванович"
                            error={errors.captainName?.message}
                            {...register('captainName', { required: 'ФИО капитана обязательно' })}
                            fullWidth
                        />

                        <Input
                            label="Телефон"
                            placeholder="+7 (999) 123-45-67"
                            error={errors.captainPhone?.message}
                            {...register('captainPhone', {
                                required: 'Телефон обязателен',
                                validate: validatePhone,
                            })}
                            fullWidth
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="captain@team.ru"
                            error={errors.captainEmail?.message}
                            {...register('captainEmail', {
                                required: 'Email обязателен',
                                validate: validateEmail,
                            })}
                            fullWidth
                        />
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Состав команды</h2>
                            <span className={styles.playerCount}>
                {fields.length} / 14 игроков
              </span>
                        </div>

                        <div className={styles.playersHeader}>
                            <span>ФИО</span>
                            <span>Дата рождения</span>
                            <span>Рост (см)</span>
                            <span>Позиция</span>
                            <span>Уровень</span>
                            <span></span>
                        </div>

                        {fields.map((field, idx) => (
                            <PlayerRowInput
                                key={field.id}
                                index={idx}
                                player={playersValues?.[idx] || {
                                    fullName: '',
                                    birthDate: '',
                                    heightCm: 0,
                                    position: 'attacker',
                                    skillLevel: 'light'
                                }}
                                onChange={handlePlayerChange}
                                onRemove={removePlayer}
                                errors={errors.players?.[idx] as any || {}}
                            />
                        ))}

                        {fields.length < 14 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addPlayer}
                                className={styles.addButton}
                            >
                                + Добавить игрока
                            </Button>
                        )}
                    </section>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={createApplication.isPending}
                        className={styles.submitButton}
                    >
                        Отправить заявку
                    </Button>
                </form>
            </div>
        </div>
    );
};