export const SKILL_LEVELS = [
    { value: 'light', label: 'Лайт' },
    { value: 'light_plus', label: 'Лайт+' },
    { value: 'light_plus_plus', label: 'Лайт++' },
    { value: 'medium', label: 'Медиум' },
    { value: 'medium_plus', label: 'Медиум+' },
    { value: 'hard', label: 'Хард' },
    { value: 'hard_plus', label: 'Хард+' },
] as const;

export const SKILL_LEVEL_LABELS: Record<string, string> = {
    light: 'Лайт',
    light_plus: 'Лайт+',
    light_plus_plus: 'Лайт++',
    medium: 'Медиум',
    medium_plus: 'Медиум+',
    hard: 'Хард',
    hard_plus: 'Хард+',
};

export const SKILL_LEVEL_COLORS: Record<string, string> = {
    light: 'default',
    light_plus: 'info',
    light_plus_plus: 'info',
    medium: 'primary',
    medium_plus: 'primary',
    hard: 'danger',
    hard_plus: 'danger',
};