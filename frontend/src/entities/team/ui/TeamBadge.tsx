import React from 'react';
import { Badge } from '@shared/ui';

interface TeamBadgeProps {
    division: string;
    groupLetter?: string | null;
    isWaiting?: boolean;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({
                                                        division,
                                                        groupLetter,
                                                        isWaiting,
                                                    }) => {
    const divisionLabel = division === 'hard' ? 'Хард-лига' : 'Лайт-лига';
    const divisionColor = division === 'hard' ? 'danger' : 'success';

    return (
        <div className="flex gap-2">
            <Badge variant={divisionColor}>{divisionLabel}</Badge>
            {groupLetter && (
                <Badge variant="info">Группа {groupLetter}</Badge>
            )}
            {isWaiting && (
                <Badge variant="warning">Лист ожидания</Badge>
            )}
        </div>
    );
};