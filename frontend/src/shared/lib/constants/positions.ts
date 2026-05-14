export const POSITIONS = [
    { value: 'attacker', label: 'Нападающий' },
    { value: 'setter', label: 'Связующий' },
    { value: 'libero', label: 'Либеро' },
    { value: 'blocker', label: 'Блокирующий' },
] as const;

export const POSITION_LABELS: Record<string, string> = {
    attacker: 'Нападающий',
    setter: 'Связующий',
    libero: 'Либеро',
    blocker: 'Блокирующий',
};