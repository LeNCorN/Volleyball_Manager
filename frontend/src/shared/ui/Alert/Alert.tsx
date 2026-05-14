import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Alert.module.css';

interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    closable?: boolean;
    className?: string;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
                                                type = 'info',
                                                title,
                                                message,
                                                closable = true,
                                                className,
                                                onClose,
                                            }) => {
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    if (!visible) return null;

    return (
        <div className={clsx(styles.alert, styles[type], className)}>
            <div className={styles.content}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.message}>{message}</div>
            </div>
            {closable && (
                <button className={styles.closeButton} onClick={handleClose}>
                    ×
                </button>
            )}
        </div>
    );
};