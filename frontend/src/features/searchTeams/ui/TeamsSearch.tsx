import React, { useState } from 'react';
import { Input, Select } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { TeamCard } from '@entities/team';
import { DIVISIONS } from '@shared/lib/constants/divisions';
import { useTeamsSearch } from '../model/useTeamsSearch';
import { useDebounce } from '@shared/lib/hooks/useDebounce';
import styles from './TeamsSearch.module.css';

export const TeamsSearch: React.FC = () => {
    const [division, setDivision] = useState('');
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const { data: teams, isLoading } = useTeamsSearch({
        division: division || undefined,
        search: debouncedSearch || undefined,
    });

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <Input
                    placeholder="Поиск по названию команды..."
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
            </div>

            <div className={styles.results}>
                {isLoading ? (
                    <div className={styles.loading}><LoadingSpinner /></div>
                ) : !teams?.length ? (
                    <div className={styles.empty}>Команды не найдены</div>
                ) : (
                    <div className={styles.grid}>
                        {teams.map((team: any) => (
                            <TeamCard key={team.id} {...team} compact />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};