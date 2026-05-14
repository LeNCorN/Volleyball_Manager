export const getScoreLabel = (score: number): string => {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
};