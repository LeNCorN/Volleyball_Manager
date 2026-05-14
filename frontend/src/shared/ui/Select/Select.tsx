import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Select.module.css';

interface Option {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[];
    error?: string;
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, fullWidth = false, className, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className={clsx(styles.container, { [styles.fullWidth]: fullWidth })}>
                {label && (
                    <label htmlFor={selectId} className={styles.label}>
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={clsx(styles.select, { [styles.error]: error }, className)}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';