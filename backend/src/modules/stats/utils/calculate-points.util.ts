export function calculateTournamentPoints(homeSetsWon: number, awaySetsWon: number): { homePoints: number; awayPoints: number } {
  if (homeSetsWon === 3 && awaySetsWon === 0) {
    return { homePoints: 3, awayPoints: 0 };
  }
  if (homeSetsWon === 3 && awaySetsWon === 1) {
    return { homePoints: 3, awayPoints: 0 };
  }
  if (homeSetsWon === 3 && awaySetsWon === 2) {
    return { homePoints: 2, awayPoints: 1 };
  }
  if (homeSetsWon === 2 && awaySetsWon === 3) {
    return { homePoints: 1, awayPoints: 2 };
  }
  if (homeSetsWon === 1 && awaySetsWon === 3) {
    return { homePoints: 0, awayPoints: 3 };
  }
  if (homeSetsWon === 0 && awaySetsWon === 3) {
    return { homePoints: 0, awayPoints: 3 };
  }

  return { homePoints: 0, awayPoints: 0 };
}