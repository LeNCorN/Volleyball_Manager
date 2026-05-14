import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Tabs.module.css';

export interface TabItem {
    key: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    tabs: TabItem[];
    defaultActiveKey?: string;
    onChange?: (key: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveKey, onChange }) => {
    const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.key);

    const handleTabClick = (key: string) => {
        if (tabs.find(t => t.key === key)?.disabled) return;
        setActiveKey(key);
        onChange?.(key);
    };

    const activeTab = tabs.find(t => t.key === activeKey);

    return (
        <div className={styles.tabs}>
            <div className={styles.tabHeaders}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={clsx(styles.tabButton, {
                            [styles.active]: activeKey === tab.key,
                            [styles.disabled]: tab.disabled,
                        })}
                        onClick={() => handleTabClick(tab.key)}
                        disabled={tab.disabled}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className={styles.tabContent}>{activeTab?.content}</div>
        </div>
    );
};