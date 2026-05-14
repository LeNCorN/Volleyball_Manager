import React from 'react';
import clsx from 'clsx';
import styles from './Table.module.css';

interface Column<T = any> {
    key: string;
    title: string;
    render?: (item: T, index: number) => React.ReactNode;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
}

interface TableProps<T = any> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T, index: number) => void;
}

export function Table<T extends { id?: string | number }>({
                                                              columns,
                                                              data,
                                                              loading = false,
                                                              emptyMessage = 'Нет данных',
                                                              onRowClick,
                                                          }: TableProps<T>) {
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (data.length === 0) {
        return <div className={styles.emptyMessage}>{emptyMessage}</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            style={{ width: column.width, textAlign: column.align || 'left' }}
                            className={styles.th}
                        >
                            {column.title}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr
                        key={item.id || index}
                        className={clsx(styles.tr, { [styles.clickable]: !!onRowClick })}
                        onClick={() => onRowClick?.(item, index)}
                    >
                        {columns.map((column) => (
                            <td
                                key={column.key}
                                style={{ textAlign: column.align || 'left' }}
                                className={styles.td}
                            >
                                {column.render ? column.render(item, index) : (item as any)[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}