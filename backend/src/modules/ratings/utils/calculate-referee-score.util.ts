export interface RefereeStats {
  averageScore: number;
  matchesCount: number;
  uniqueTeamsCount: number;
}

/**
 * Расчёт итогового балла судьи по формуле:
 * Итоговый балл = (средняя оценка × 20) + (количество матчей × 0.5) + (количество разных команд × 0.3)
 */
export function calculateFinalScore(stats: RefereeStats): number {
  const SCORE_WEIGHT = 20;
  const MATCHES_WEIGHT = 0.5;
  const TEAMS_WEIGHT = 0.3;

  return Number(
    (stats.averageScore * SCORE_WEIGHT +
      stats.matchesCount * MATCHES_WEIGHT +
      stats.uniqueTeamsCount * TEAMS_WEIGHT).toFixed(2),
  );
}