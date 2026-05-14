import React, { useState } from 'react';
import { Input, Select } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner//LoadingSpinner';
import { PlayerRow } from '@entities/player';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import { POSITIONS, POSITION_LABELS } from '@shared/lib/constants/positions';
import { SKILL_LEVELS, SKILL_LEVEL_LABELS } from '@shared/lib/constants/skillLevels';
import { usePlayersSearch } from '../model/usePlayersSearch';
import { useDebounce } from '@shared/lib/hooks/useDebounce';
import styles from './PlayersSearch.module.css';

export const PlayersSearch: React.FC = () => {
    const [division, setDivision] = useState('');
    const [position, setPosition] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const { data: players, isLoading } = usePlayersSearch({
        division: division || undefined,
        position: position || undefined,
        skillLevel: skillLevel || undefined,
        search: debouncedSearch || undefined,
    });

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <Input
                    placeholder="Поиск по ФИО..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />

                <Select
                    options={[{ value: '', label: 'Все лиги' }, ...DIVISIONS.map(d => ({ value: d.value, label: d.label }))]}
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className={styles.filterSelect}
                />

                <Select
                    options={[{ value: '', label: 'Все позиции' }, ...POSITIONS.map(p => ({ value: p.value, label: POSITION_LABELS[p.value] }))]}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={styles.filterSelect}
                />

                <Select
                    options={[{ value: '', label: 'Все уровни' }, ...SKILL_LEVELS.map(s => ({ value: s.value, label: SKILL_LEVEL_LABELS[s.value] }))]}
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className={styles.filterSelect}
                />
            </div>

            <div className={styles.results}>
                {isLoading ? (
                    <div className={styles.loading}><LoadingSpinner /></div>
                ) : !players?.length ? (
                    <div className={styles.empty}>Игроки не найдены</div>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.header}>
                            <span>ФИО</span>
                            <span>Команда</span>
                            <span>Позиция</span>
                            <span>Уровень</span>
                            <span>Рост</span>
                            <span>Возраст</span>
                        </div>
                        {players.map((player: any) => (
                            <PlayerRow key={player.id} {...player} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};