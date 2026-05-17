/**
 * Расчёт турнирных очков по правилам волейбола FIVB
 *
 * @param homeSetsWon - количество сетов, выигранных командой хозяев
 * @param awaySetsWon - количество сетов, выигранных командой гостей
 * @returns объект с очками для команды хозяев и команды гостей
 *
 * Правила:
 * - Победа 3:0 или 3:1 → 3 очка победителю, 0 очков проигравшему
 * - Победа 3:2 → 2 очка победителю, 1 очко проигравшему
 * - Поражение 2:3 → 1 очко проигравшему, 2 очка победителю (отражено в первом условии)
 * - Поражение 1:3 или 0:3 → 0 очков проигравшему
 */
export function calculateTournamentPoints(homeSetsWon: number, awaySetsWon: number): { homePoints: number; awayPoints: number } {
  // Победа хозяев 3:0 или 3:1
  if (homeSetsWon === 3 && (awaySetsWon === 0 || awaySetsWon === 1)) {
    return { homePoints: 3, awayPoints: 0 };
  }

  // Победа хозяев 3:2
  if (homeSetsWon === 3 && awaySetsWon === 2) {
    return { homePoints: 2, awayPoints: 1 };
  }

  // Победа гостей 3:0 или 3:1
  if (awaySetsWon === 3 && (homeSetsWon === 0 || homeSetsWon === 1)) {
    return { homePoints: 0, awayPoints: 3 };
  }

  // Победа гостей 3:2
  if (awaySetsWon === 3 && homeSetsWon === 2) {
    return { homePoints: 1, awayPoints: 2 };
  }

  // Если что-то пошло не так (должно быть покрыто выше)
  return { homePoints: 0, awayPoints: 0 };
}