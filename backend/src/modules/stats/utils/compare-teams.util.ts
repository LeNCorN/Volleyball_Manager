export interface TeamStanding {
  teamId: string;
  teamName: string;
  tournamentPoints: number;
  setsWon: number;
  setsLost: number;
  pointsFor: number;
  pointsAgainst: number;
}

/**
 * Сравнение двух команд для сортировки турнирной таблицы
 * Критерии в порядке приоритета:
 * 1. Турнирные очки
 * 2. Разница выигранных и проигранных сетов
 * 3. Разница набранных и пропущенных очков (мячей)
 * 4. Результат личной встречи
 */
export function compareTeams(a: TeamStanding, b: TeamStanding, headToHeadWinner?: string): number {
  // 1. Турнирные очки
  if (a.tournamentPoints !== b.tournamentPoints) {
    return b.tournamentPoints - a.tournamentPoints;
  }

  // 2. Разница сетов
  const aSetDiff = a.setsWon - a.setsLost;
  const bSetDiff = b.setsWon - b.setsLost;
  if (aSetDiff !== bSetDiff) {
    return bSetDiff - aSetDiff;
  }

  // 3. Разница мячей
  const aPointDiff = a.pointsFor - a.pointsAgainst;
  const bPointDiff = b.pointsFor - b.pointsAgainst;
  if (aPointDiff !== bPointDiff) {
    return bPointDiff - aPointDiff;
  }

  // 4. Результат личной встречи
  if (headToHeadWinner === a.teamId) return -1;
  if (headToHeadWinner === b.teamId) return 1;

  return 0;
}

/**
 * Сортировка команд с учётом личных встреч
 */
export function sortStandings(
  standings: TeamStanding[],
  headToHeadResults: Map<string, Map<string, string>>
): TeamStanding[] {
  return [...standings].sort((a, b) => {
    const headToHeadWinner = headToHeadResults.get(a.teamId)?.get(b.teamId);
    return compareTeams(a, b, headToHeadWinner);
  });
}