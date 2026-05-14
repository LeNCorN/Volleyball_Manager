import React from 'react';
import { Button } from '@shared/ui';
import styles from './WaitingListActions.module.css';

interface WaitingListActionsProps {
    onConfigureGroups: () => void;
    disabled?: boolean;
}

export const WaitingListActions: React.FC<WaitingListActionsProps> = ({
                                                                          onConfigureGroups,
                                                                          disabled,
                                                                      }) => {
    return (
        <div className={styles.actions}>
            <Button
                variant="primary"
                onClick={onConfigureGroups}
                disabled={disabled}
            >
                🏆 Сформировать группы
            </Button>
        </div>
    );
};