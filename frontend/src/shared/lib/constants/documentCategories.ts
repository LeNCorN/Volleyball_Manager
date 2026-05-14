export const DOCUMENT_CATEGORIES = [
    { value: 'regulations', label: 'Регламенты', icon: '📋' },
    { value: 'volleyball_rules', label: 'Правила волейбола', icon: '🏐' },
    { value: 'referee_rules', label: 'Правила судейства', icon: '⚖️' },
    { value: 'other', label: 'Другое', icon: '📄' },
] as const;

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
    regulations: 'Регламент',
    volleyball_rules: 'Правила волейбола',
    referee_rules: 'Правила судейства',
    other: 'Другое',
};

export const DOCUMENT_CATEGORY_VARIANTS: Record<string, string> = {
    regulations: 'primary',
    volleyball_rules: 'info',
    referee_rules: 'success',
    other: 'default',
};