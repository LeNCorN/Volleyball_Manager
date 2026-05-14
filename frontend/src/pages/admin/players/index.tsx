import React, { useState } from 'react';
import { usePlayersSearch } from '@features/searchPlayers/model/usePlayersSearch';
import { PlayerSkillCell } from '@features/updatePlayerSkill/ui/PlayerSkillCell';
import { Input, Select } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import { POSITIONS, POSITION_LABELS } from '@shared/lib/constants/positions';
import { SKILL_LEVELS, SKILL_LEVEL_LABELS } from '@shared/lib/constants/skillLevels';
import { useDebounce } from '@shared/lib/hooks/useDebounce';
import styles from './index.module.css';

const AdminPlayersPage: React.FC = () => {
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
            <div className={styles.header}>
                <h1 className={styles.title}>Управление игроками</h1>
                <p className={styles.subtitle}>
                    Изменение уровня мастерства игроков
                </p>
            </div>

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

            {isLoading ? (
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Команда</th>
                            <th>Лига</th>
                            <th>Позиция</th>
                            <th>Рост</th>
                            <th>Возраст</th>
                            <th>Уровень мастерства</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players?.map((player: any) => (
                            <tr key={player.id}>
                                <td>{player.fullName}</td>
                                <td>{player.teamName || '—'}</td>
                                <td>{player.division === 'hard' ? 'Хард' : 'Лайт'}</td>
                                <td>{POSITION_LABELS[player.position] || player.position}</td>
                                <td>{player.heightCm} см</td>
                                <td>{player.age} лет</td>
                                <td>
                                    <PlayerSkillCell
                                        playerId={player.id}
                                        currentSkill={player.skillLevel}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {!players?.length && (
                        <div className={styles.empty}>
                            <p>Игроки не найдены</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPlayersPage;