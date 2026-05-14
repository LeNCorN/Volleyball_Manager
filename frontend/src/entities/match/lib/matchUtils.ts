export const getMatchStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        scheduled: 'Запланирован',
        in_progress: 'В процессе',
        finished: 'Завершён',
        forfeit: 'Техническое поражение',
    };
    return labels[status] || status;
};

export const formatMatchResult = (
    homeSetsWon: number,
    awaySetsWon: number
): string => {
    return `${homeSetsWon}:${awaySetsWon}`;
};