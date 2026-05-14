import React from 'react';
import styles from './MatchResultTooltip.module.css';

interface MatchResultTooltipProps {
    result: string;
    sets?: Array<{ homePoints: number; awayPoints: number }>;
    children: React.ReactElement;
}

export const MatchResultTooltip: React.FC<MatchResultTooltipProps> = ({
                                                                          result,
                                                                          sets,
                                                                          children,
                                                                      }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    if (!sets || sets.length === 0) {
        return children;
    }

    return (
        <div
            className={styles.tooltipWrapper}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {React.cloneElement(children, { className: styles.trigger })}
            {isVisible && (
                <div className={styles.tooltip}>
                    <div className={styles.tooltipTitle}>{result}</div>
                    <div className={styles.setsList}>
                        {sets.map((set, idx) => (
                            <div key={idx} className={styles.setItem}>
                                {idx + 1}-й сет: {set.homePoints} : {set.awayPoints}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};