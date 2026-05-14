import React from 'react';
import { Input, Select, Button } from '@shared/ui';
import { POSITIONS, POSITION_LABELS } from '@shared/lib/constants/positions';
import { SKILL_LEVELS, SKILL_LEVEL_LABELS } from '@shared/lib/constants/skillLevels';
import styles from './PlayerRowInput.module.css';

interface PlayerData {
    fullName: string;
    birthDate: string;
    heightCm: number;
    position: string;
    skillLevel: string;
}

interface PlayerRowInputProps {
    index: number;
    player: PlayerData;
    onChange: (index: number, field: keyof PlayerData, value: string | number) => void;
    onRemove: (index: number) => void;
    errors: Record<string, string>;
}

export const PlayerRowInput: React.FC<PlayerRowInputProps> = ({
                                                                  index,
                                                                  player,
                                                                  onChange,
                                                                  onRemove,
                                                                  errors,
                                                              }) => {
    return (
        <div className={styles.row}>
            <div className={styles.fields}>
                <Input
                    placeholder="ФИО"
                    value={player.fullName}
                    onChange={(e) => onChange(index, 'fullName', e.target.value)}
                    error={errors.fullName}
                    className={styles.fieldName}
                />
                <Input
                    type="date"
                    placeholder="Дата рождения"
                    value={player.birthDate}
                    onChange={(e) => onChange(index, 'birthDate', e.target.value)}
                    error={errors.birthDate}
                    className={styles.fieldDate}
                />
                <Input
                    type="number"
                    placeholder="Рост (см)"
                    value={player.heightCm || ''}
                    onChange={(e) => onChange(index, 'heightCm', parseInt(e.target.value) || 0)}
                    error={errors.heightCm}
                    className={styles.fieldHeight}
                />
                <Select
                    options={POSITIONS.map(p => ({ value: p.value, label: POSITION_LABELS[p.value] }))}
                    value={player.position || 'attacker'}
                    onChange={(e) => onChange(index, 'position', e.target.value)}
                    error={errors.position}
                    className={styles.fieldPosition}
                />
                <Select
                    options={SKILL_LEVELS.map(s => ({ value: s.value, label: SKILL_LEVEL_LABELS[s.value] }))}
                    value={player.skillLevel || 'light'}
                    onChange={(e) => onChange(index, 'skillLevel', e.target.value)}
                    error={errors.skillLevel}
                    className={styles.fieldSkill}
                />
            </div>
            <Button
                variant="danger"
                size="sm"
                onClick={() => onRemove(index)}
                className={styles.removeButton}
            >
                ✕
            </Button>
        </div>
    );
};