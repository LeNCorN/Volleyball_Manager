export interface SetValidationResult {
    isValid: boolean;
    errors: string[];
    homeSetsWon: number;
    awaySetsWon: number;
    homeTotalPoints: number;
    awayTotalPoints: number;
}

export const validateSets = (sets: Array<{ homePoints: number; awayPoints: number }>): SetValidationResult => {
    const errors: string[] = [];
    let homeSetsWon = 0;
    let awaySetsWon = 0;
    let homeTotalPoints = 0;
    let awayTotalPoints = 0;

    if (sets.length < 3 || sets.length > 5) {
        errors.push('Матч должен содержать от 3 до 5 сетов');
    }

    for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const setNumber = i + 1;
        const diff = Math.abs(set.homePoints - set.awayPoints);
        const maxPoints = Math.max(set.homePoints, set.awayPoints);
        const isTiebreak = setNumber === 5;
        const requiredMinPoints = isTiebreak ? 15 : 25;

        if (diff < 2) {
            errors.push(`Сет ${setNumber}: победа должна быть с разницей минимум 2 очка`);
        }

        if (maxPoints < requiredMinPoints) {
            errors.push(`Сет ${setNumber}: победитель должен набрать минимум ${requiredMinPoints} очков`);
        }

        if (maxPoints > 31) {
            errors.push(`Сет ${setNumber}: максимальное количество очков в сете - 31`);
        }

        if (set.homePoints > set.awayPoints) {
            homeSetsWon++;
        } else {
            awaySetsWon++;
        }

        homeTotalPoints += set.homePoints;
        awayTotalPoints += set.awayPoints;
    }

    if (homeSetsWon === awaySetsWon) {
        errors.push('Матч не может закончиться вничью');
    }

    return {
        isValid: errors.length === 0,
        errors,
        homeSetsWon,
        awaySetsWon,
        homeTotalPoints,
        awayTotalPoints,
    };
};