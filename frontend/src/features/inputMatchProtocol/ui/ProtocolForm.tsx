import React, { useState } from 'react';
import { Button, Input, Select, Alert } from '@shared/ui';
import { useMatchProtocol } from '../model/useMatchProtocol';
import { validateSets } from '../lib/validateSets';
import styles from './ProtocolForm.module.css';

interface SetScore {
    homePoints: number;
    awayPoints: number;
}

interface ProtocolFormProps {
    matchId: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeamName: string;
    awayTeamName: string;
    homePlayers?: Array<{ id: string; fullName: string }>;
    awayPlayers?: Array<{ id: string; fullName: string }>;
    refereeId?: string;
    onSuccess?: () => void;
}

export const ProtocolForm: React.FC<ProtocolFormProps> = ({
                                                              matchId,
                                                              homeTeamName,
                                                              awayTeamName,
                                                              homePlayers = [],
                                                              awayPlayers = [],
                                                              refereeId,
                                                              onSuccess,
                                                          }) => {
    const [sets, setSets] = useState<SetScore[]>([
        { homePoints: 0, awayPoints: 0 },
        { homePoints: 0, awayPoints: 0 },
        { homePoints: 0, awayPoints: 0 },
    ]);
    const [mvpHomeId, setMvpHomeId] = useState('');
    const [mvpAwayId, setMvpAwayId] = useState('');
    const [refereeRatingHome, setRefereeRatingHome] = useState<number>(5);
    const [refereeRatingAway, setRefereeRatingAway] = useState<number>(5);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const protocolMutation = useMatchProtocol(matchId);

    const addSet = () => {
        if (sets.length < 5) {
            setSets([...sets, { homePoints: 0, awayPoints: 0 }]);
        }
    };

    const removeSet = () => {
        if (sets.length > 3) {
            setSets(sets.slice(0, -1));
        }
    };

    const updateSet = (index: number, field: keyof SetScore, value: number) => {
        const newSets = [...sets];
        newSets[index][field] = value;
        setSets(newSets);
    };

    const handleSubmit = () => {
        const validation = validateSets(sets);

        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            return;
        }

        setValidationErrors([]);

        const data = {
            sets,
            mvpHomeId: mvpHomeId || undefined,
            mvpAwayId: mvpAwayId || undefined,
            refereeRatingHome,
            refereeRatingAway,
        };

        protocolMutation.mutate(data, {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    // Опции для оценки судьи (2-5)
    const refereeScoreOptions = [
        { value: 5, label: '5 ★★★★★' },
        { value: 4, label: '4 ★★★★☆' },
        { value: 3, label: '3 ★★★☆☆' },
        { value: 2, label: '2 ★★☆☆☆' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.matchHeader}>
                <span className={styles.team}>{homeTeamName}</span>
                <span className={styles.vs}>vs</span>
                <span className={styles.team}>{awayTeamName}</span>
            </div>

            {/* Секция сетов */}
            <div className={styles.setsSection}>
                <h3>Результаты сетов</h3>
                {sets.map((set, index) => (
                    <div key={index} className={styles.setRow}>
                        <span className={styles.setNumber}>{index + 1}-й сет</span>
                        <Input
                            type="number"
                            value={set.homePoints || ''}
                            onChange={(e) => updateSet(index, 'homePoints', parseInt(e.target.value) || 0)}
                            className={styles.setInput}
                            placeholder="0"
                        />
                        <span className={styles.colon}>:</span>
                        <Input
                            type="number"
                            value={set.awayPoints || ''}
                            onChange={(e) => updateSet(index, 'awayPoints', parseInt(e.target.value) || 0)}
                            className={styles.setInput}
                            placeholder="0"
                        />
                    </div>
                ))}

                <div className={styles.setButtons}>
                    <Button type="button" variant="outline" size="sm" onClick={removeSet} disabled={sets.length <= 3}>
                        - Удалить сет
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={addSet} disabled={sets.length >= 5}>
                        + Добавить сет
                    </Button>
                </div>
            </div>

            {/* Секция MVP */}
            <div className={styles.mvpSection}>
                <h3>Лучшие игроки матча (MVP)</h3>

                <div className={styles.mvpRow}>
                    <span>MVP от команды {homeTeamName}</span>
                    <Select
                        options={[
                            { value: '', label: '-- Выберите игрока --' },
                            ...homePlayers.map(p => ({ value: p.id, label: p.fullName })),
                        ]}
                        value={mvpHomeId}
                        onChange={(e) => setMvpHomeId(e.target.value)}
                        className={styles.mvpSelect}
                    />
                </div>

                <div className={styles.mvpRow}>
                    <span>MVP от команды {awayTeamName}</span>
                    <Select
                        options={[
                            { value: '', label: '-- Выберите игрока --' },
                            ...awayPlayers.map(p => ({ value: p.id, label: p.fullName })),
                        ]}
                        value={mvpAwayId}
                        onChange={(e) => setMvpAwayId(e.target.value)}
                        className={styles.mvpSelect}
                    />
                </div>
            </div>

            {/* Секция оценки судьи */}
            {refereeId && (
                <div className={styles.refereeSection}>
                    <h3>Оценка судьи</h3>

                    <div className={styles.ratingRow}>
                        <span>Оценка от команды {homeTeamName}</span>
                        <div className={styles.stars}>
                            {refereeScoreOptions.map((option) => (
                                <label key={option.value} className={styles.starLabel}>
                                    <input
                                        type="radio"
                                        name="refereeRatingHome"
                                        value={option.value}
                                        checked={refereeRatingHome === option.value}
                                        onChange={() => setRefereeRatingHome(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.ratingRow}>
                        <span>Оценка от команды {awayTeamName}</span>
                        <div className={styles.stars}>
                            {refereeScoreOptions.map((option) => (
                                <label key={option.value} className={styles.starLabel}>
                                    <input
                                        type="radio"
                                        name="refereeRatingAway"
                                        value={option.value}
                                        checked={refereeRatingAway === option.value}
                                        onChange={() => setRefereeRatingAway(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Сообщение, если судья не назначен */}
            {!refereeId && (
                <div className={styles.refereeSection}>
                    <h3>Оценка судьи</h3>
                    <Alert type="warning" message="Судья не назначен на этот матч. Оценка недоступна." />
                </div>
            )}

            {/* Ошибки валидации */}
            {validationErrors.length > 0 && (
                <div className={styles.errors}>
                    {validationErrors.map((err, i) => (
                        <Alert key={i} type="error" message={err} />
                    ))}
                </div>
            )}

            {/* Ошибка запроса */}
            {protocolMutation.isError && (
                <Alert type="error" message="Ошибка при сохранении протокола" />
            )}

            {/* Кнопка отправки */}
            <div className={styles.submit}>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    loading={protocolMutation.isPending}
                    fullWidth
                >
                    Сохранить протокол
                </Button>
            </div>
        </div>
    );
};