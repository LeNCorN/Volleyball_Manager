import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class ArchiveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async archiveCurrentSeason() {
    const currentSeason = await this.prisma.season.findFirst({
      where: { isActive: true },
    });

    if (!currentSeason) {
      throw new NotFoundException('Активный сезон не найден');
    }

    console.log(`Архивация сезона: ${currentSeason.name} (ID: ${currentSeason.id})`);

    const divisions = await this.prisma.division.findMany();

    // Архивируем турнирные таблицы
    for (const division of divisions) {
      const standings = await this.calculateStandingsForArchive(division.name);

      for (const standing of standings) {
        await this.prisma.archivedStanding.create({
          data: {
            seasonId: currentSeason.id,
            teamId: standing.teamId,
            teamName: standing.teamName,
            division: division.name,
            matchesPlayed: standing.matchesPlayed,
            wins: standing.wins,
            losses: standing.losses,
            setsWon: standing.setsWon,
            setsLost: standing.setsLost,
            pointsFor: standing.pointsFor,
            pointsAgainst: standing.pointsAgainst,
            tournamentPoints: standing.tournamentPoints,
          },
        });
      }
      console.log(`Архивирована таблица для дивизиона ${division.name}: ${standings.length} записей`);
    }

    // Архивируем все матчи
    const matches = await this.prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
        sets: {
          orderBy: { setNumber: 'asc' },
        },
        protocol: true,
      },
    });

    console.log(`Найдено матчей для архивации: ${matches.length}`);

    let archivedMatchesCount = 0;
    for (const match of matches) {
      const setsData = match.sets.map(set => ({
        homePoints: set.homePoints,
        awayPoints: set.awayPoints,
      }));

      const homeSetsWon = match.protocol?.homeSetsWon || 0;
      const awaySetsWon = match.protocol?.awaySetsWon || 0;

      await this.prisma.archivedMatch.create({
        data: {
          seasonId: currentSeason.id,
          division: match.groupLetter || 'unknown',
          homeTeamId: match.homeTeamId,
          homeTeamName: match.homeTeam.name,
          awayTeamId: match.awayTeamId,
          awayTeamName: match.awayTeam.name,
          matchDate: match.matchDate,
          homeSetsWon,
          awaySetsWon,
          sets: setsData,
        },
      });
      archivedMatchesCount++;
    }
    console.log(`Архивировано матчей: ${archivedMatchesCount}`);

    const archivedSeason = await this.prisma.archivedSeason.create({
      data: {
        seasonId: currentSeason.id,
        name: currentSeason.name,
        startDate: currentSeason.startDate,
        endDate: currentSeason.endDate,
        archivedAt: new Date(),
      },
    });

    await this.prisma.season.update({
      where: { id: currentSeason.id },
      data: { isActive: false },
    });

    await this.invalidateCache();

    return {
      message: `Сезон "${currentSeason.name}" успешно архивирован`,
      archivedSeason,
      stats: {
        archivedStandingsCount: await this.prisma.archivedStanding.count({
          where: { seasonId: currentSeason.id },
        }),
        archivedMatchesCount: await this.prisma.archivedMatch.count({
          where: { seasonId: currentSeason.id },
        }),
      },
    };
  }

  async getArchivedSeasons() {
    const cacheKey = 'archive:seasons';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const seasons = await this.prisma.archivedSeason.findMany({
      orderBy: { archivedAt: 'desc' },
    });

    await this.redis.set(cacheKey, seasons, 3600);
    return seasons;
  }

  async getArchivedStandings(seasonId: number) {
    const cacheKey = `archive:standings:${seasonId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const standings = await this.prisma.archivedStanding.findMany({
      where: { seasonId },
      orderBy: { tournamentPoints: 'desc' },
    });

    const standingsByDivision: Record<string, any[]> = {};
    for (const standing of standings) {
      if (!standingsByDivision[standing.division]) {
        standingsByDivision[standing.division] = [];
      }
      standingsByDivision[standing.division].push(standing);
    }

    await this.redis.set(cacheKey, standingsByDivision, 3600);
    return standingsByDivision;
  }

  async getArchivedMatches(seasonId: number, division?: string) {
    const cacheKey = division
      ? `archive:matches:${seasonId}:${division}`
      : `archive:matches:${seasonId}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = { seasonId };
    if (division) {
      where.division = division;
    }

    const matches = await this.prisma.archivedMatch.findMany({
      where,
      orderBy: { matchDate: 'asc' },
    });

    // Преобразуем данные в формат, удобный для отображения
    const formattedMatches = matches.map(match => ({
      id: match.id,
      division: match.division,
      homeTeamName: match.homeTeamName,
      awayTeamName: match.awayTeamName,
      matchDate: match.matchDate,
      homeSetsWon: match.homeSetsWon,
      awaySetsWon: match.awaySetsWon,
      sets: match.sets as Array<{ homePoints: number; awayPoints: number }>,
      result: `${match.homeSetsWon}:${match.awaySetsWon}`,
    }));

    await this.redis.set(cacheKey, formattedMatches, 3600);
    return formattedMatches;
  }

  private async calculateStandingsForArchive(division: string) {
    const divisionEntity = await this.prisma.division.findFirst({
      where: { name: division },
    });

    if (!divisionEntity) return [];

    const teams = await this.prisma.team.findMany({
      where: { divisionId: divisionEntity.id, isWaiting: false },
      include: {
        homeMatches: {
          where: { status: 'finished' },
          include: { protocol: true },
        },
        awayMatches: {
          where: { status: 'finished' },
          include: { protocol: true },
        },
      },
    });

    const standings = [];
    for (const team of teams) {
      let matchesPlayed = 0;
      let wins = 0;
      let losses = 0;
      let setsWon = 0;
      let setsLost = 0;
      let pointsFor = 0;
      let pointsAgainst = 0;
      let tournamentPoints = 0;

      for (const match of team.homeMatches) {
        const p = match.protocol;
        if (!p) continue;
        matchesPlayed++;
        if (p.homeSetsWon > p.awaySetsWon) wins++;
        else losses++;
        setsWon += p.homeSetsWon;
        setsLost += p.awaySetsWon;
        pointsFor += p.homeTotalPoints;
        pointsAgainst += p.awayTotalPoints;

        if (p.homeSetsWon === 3 && (p.awaySetsWon === 0 || p.awaySetsWon === 1)) {
          tournamentPoints += 3;
        } else if (p.homeSetsWon === 3 && p.awaySetsWon === 2) {
          tournamentPoints += 2;
        } else if (p.homeSetsWon === 2 && p.awaySetsWon === 3) {
          tournamentPoints += 1;
        }
      }

      for (const match of team.awayMatches) {
        const p = match.protocol;
        if (!p) continue;
        matchesPlayed++;
        if (p.awaySetsWon > p.homeSetsWon) wins++;
        else losses++;
        setsWon += p.awaySetsWon;
        setsLost += p.homeSetsWon;
        pointsFor += p.awayTotalPoints;
        pointsAgainst += p.homeTotalPoints;

        if (p.awaySetsWon === 3 && (p.homeSetsWon === 0 || p.homeSetsWon === 1)) {
          tournamentPoints += 3;
        } else if (p.awaySetsWon === 3 && p.homeSetsWon === 2) {
          tournamentPoints += 2;
        } else if (p.awaySetsWon === 2 && p.homeSetsWon === 3) {
          tournamentPoints += 1;
        }
      }

      standings.push({
        teamId: team.id,
        teamName: team.name,
        matchesPlayed,
        wins,
        losses,
        setsWon,
        setsLost,
        pointsFor,
        pointsAgainst,
        tournamentPoints,
      });
    }

    return standings.sort((a, b) => b.tournamentPoints - a.tournamentPoints);
  }

  private async invalidateCache() {
    await this.redis.del('archive:seasons');
    await this.redis.invalidate('archive:standings:*');
    await this.redis.invalidate('archive:matches:*');
  }
}