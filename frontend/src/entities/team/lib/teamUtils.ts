export const getDivisionLabel = (division: string): string => {
    return division === 'hard' ? 'Хард-лига' : 'Лайт-лига';
};

export const getDivisionColor = (division: string): 'danger' | 'success' => {
    return division === 'hard' ? 'danger' : 'success';
};

export const calculateAverageHeight = (players: Array<{ heightCm: number }>): number => {
    if (players.length === 0) return 0;
    const sum = players.reduce((acc, p) => acc + p.heightCm, 0);
    return Math.round(sum / players.length);
};

export const calculateAverageAge = (players: Array<{ birthDate: string }>): number => {
    if (players.length === 0) return 0;
    const currentYear = new Date().getFullYear();
    const sum = players.reduce((acc, p) => {
        const age = currentYear - new Date(p.birthDate).getFullYear();
        return acc + age;
    }, 0);
    return Math.round(sum / players.length);
};