export interface MatchPair {
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  round: number;
}

export class RoundRobinAlgorithm {
  generate(teams: Array<{ id: string; name: string }>): MatchPair[] {
    const n = teams.length;
    const matches: MatchPair[] = [];

    if (n < 2) return matches;

    // Для нечётного количества добавляем фиктивную команду ("выходной")
    const isOdd = n % 2 === 1;
    let teamsList = [...teams];
    if (isOdd) {
      teamsList.push({ id: 'bye', name: 'BYE' });
    }

    const m = teamsList.length;
    const rounds = m - 1;

    for (let round = 0; round < rounds; round++) {
      for (let i = 0; i < m / 2; i++) {
        const home = teamsList[i];
        const away = teamsList[m - 1 - i];

        // Пропускаем фиктивные матчи
        if (home.id !== 'bye' && away.id !== 'bye') {
          matches.push({
            homeTeamId: home.id,
            homeTeamName: home.name,
            awayTeamId: away.id,
            awayTeamName: away.name,
            round: round + 1,
          });
        }
      }

      // Вращение массива (фиксируем первый элемент)
      const last = teamsList.pop()!;
      teamsList.splice(1, 0, last);
    }

    return matches;
  }
}