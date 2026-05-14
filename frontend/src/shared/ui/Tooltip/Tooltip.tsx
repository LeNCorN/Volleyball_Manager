import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Tooltip.module.css';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
                                                    children,
                                                    content,
                                                    position = 'top',
                                                    delay = 200,
                                                }) => {
    const [isVisible, setIsVisible] = useState(false);
    let timeoutId: ReturnType<typeof setTimeout>;

    const showTooltip = () => {
        timeoutId = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        clearTimeout(timeoutId);
        setIsVisible(false);
    };

    return (
        <div
            className={styles.tooltipWrapper}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {isVisible && (
                <div className={clsx(styles.tooltip, styles[position])}>
                    {content}
                    <span className={clsx(styles.arrow, styles[`arrow${position}`])} />
                </div>
            )}
        </div>
    );
};