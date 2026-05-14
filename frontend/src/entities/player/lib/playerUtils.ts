export const getPositionLabel = (position: string): string => {
    const labels: Record<string, string> = {
        attacker: 'Нападающий',
        setter: 'Связующий',
        libero: 'Либеро',
        blocker: 'Блокирующий',
    };
    return labels[position] || position;
};

export const getSkillLevelLabel = (level: string): string => {
    const labels: Record<string, string> = {
        light: 'Лайт',
        light_plus: 'Лайт+',
        light_plus_plus: 'Лайт++',
        medium: 'Медиум',
        medium_plus: 'Медиум+',
        hard: 'Хард',
        hard_plus: 'Хард+',
    };
    return labels[level] || level;
};

export const getSkillLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
        light: 'default',
        light_plus: 'info',
        light_plus_plus: 'info',
        medium: 'primary',
        medium_plus: 'primary',
        hard: 'danger',
        hard_plus: 'danger',
    };
    return colors[level] || 'default';
};

export const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};