export const DIVISIONS = [
    { value: 'hard', label: 'Хард-лига' },
    { value: 'light', label: 'Лайт-лига' },
] as const;

export const DIVISION_LABELS: Record<string, string> = {
    hard: 'Хард-лига',
    light: 'Лайт-лига',
};