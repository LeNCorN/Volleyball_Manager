import React, { useState } from 'react';
import { Select } from '@shared/ui';
import { SKILL_LEVELS, SKILL_LEVEL_LABELS } from '@shared/lib/constants/skillLevels';
import { useUpdatePlayerSkill } from '../model/useUpdatePlayerSkill';
import styles from './PlayerSkillCell.module.css';

interface PlayerSkillCellProps {
    playerId: string;
    currentSkill: string;
}

export const PlayerSkillCell: React.FC<PlayerSkillCellProps> = ({
                                                                    playerId,
                                                                    currentSkill,
                                                                }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(currentSkill);
    const updateMutation = useUpdatePlayerSkill();

    const handleSave = async () => {
        if (selectedSkill === currentSkill) {
            setIsEditing(false);
            return;
        }

        await updateMutation.mutateAsync({ playerId, skillLevel: selectedSkill });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className={styles.editCell}>
                <Select
                    options={SKILL_LEVELS.map(s => ({ value: s.value, label: SKILL_LEVEL_LABELS[s.value] }))}
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className={styles.select}
                />
                <button onClick={handleSave} className={styles.saveBtn} disabled={updateMutation.isPending}>
                    💾
                </button>
                <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div className={styles.skillCell}>
            <span className={styles.skillValue}>{SKILL_LEVEL_LABELS[currentSkill] || currentSkill}</span>
            <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                ✏️
            </button>
        </div>
    );
};