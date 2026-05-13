export class SetValidator {
  private static readonly MAX_POINTS_REGULAR_SET = 25;
  private static readonly MAX_POINTS_TIEBREAK = 15;
  private static readonly MIN_POINTS_DIFFERENCE = 2;
  private static readonly MAX_POINTS_ABSOLUTE = 31;

  static validate(homePoints: number, awayPoints: number, setNumber: number): boolean {
    const diff = Math.abs(homePoints - awayPoints);
    const maxPoints = Math.max(homePoints, awayPoints);
    const minPoints = Math.min(homePoints, awayPoints);
    const isTiebreak = setNumber === 5;
    const requiredMinPoints = isTiebreak ? this.MAX_POINTS_TIEBREAK : this.MAX_POINTS_REGULAR_SET;

    // Правило 1: победа с разницей минимум 2 очка
    if (diff < this.MIN_POINTS_DIFFERENCE) {
      return false;
    }

    // Правило 2: победитель должен набрать минимум 25 (или 15 для тай-брейка)
    if (maxPoints < requiredMinPoints) {
      return false;
    }

    // Правило 3: проигравший должен набрать минимум requiredMinPoints - 2
    if (minPoints < requiredMinPoints - 2 && maxPoints > requiredMinPoints) {
      return false;
    }

    // Правило 4: абсолютный максимум (защита от бесконечных сетов)
    if (maxPoints > this.MAX_POINTS_ABSOLUTE) {
      return false;
    }

    return true;
  }

  static calculateWinner(homePoints: number, awayPoints: number): 'home' | 'away' {
    return homePoints > awayPoints ? 'home' : 'away';
  }

  static validateFullMatch(sets: Array<{ homePoints: number; awayPoints: number }>): {
    isValid: boolean;
    errors: string[];
    homeSetsWon: number;
    awaySetsWon: number;
    homeTotalPoints: number;
    awayTotalPoints: number;
  } {
    const errors: string[] = [];
    let homeSetsWon = 0;
    let awaySetsWon = 0;
    let homeTotalPoints = 0;
    let awayTotalPoints = 0;

    if (sets.length < 3 || sets.length > 5) {
      errors.push('Match must have between 3 and 5 sets');
    }

    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      const setNumber = i + 1;

      if (!this.validate(set.homePoints, set.awayPoints, setNumber)) {
        errors.push(`Set ${setNumber} is invalid: ${set.homePoints}:${set.awayPoints}`);
      }

      const winner = this.calculateWinner(set.homePoints, set.awayPoints);
      if (winner === 'home') {
        homeSetsWon++;
      } else {
        awaySetsWon++;
      }

      homeTotalPoints += set.homePoints;
      awayTotalPoints += set.awayPoints;
    }

    // Проверка на победителя матча
    if (homeSetsWon === awaySetsWon) {
      errors.push('Match cannot end in a tie');
    }

    return {
      isValid: errors.length === 0,
      errors,
      homeSetsWon,
      awaySetsWon,
      homeTotalPoints,
      awayTotalPoints,
    };
  }
}