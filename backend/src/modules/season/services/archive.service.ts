// src/modules/season/services/archive.service.ts
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

    // Получаем все дивизионы
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

    for (const match of matches) {
      const setsData = match.sets.map(set => ({
        homePoints: set.homePoints,
        awayPoints: set.awayPoints,
      }));

      await this.prisma.archivedMatch.create({
        data: {
          seasonId: currentSeason.id,
          division: match.groupLetter || 'unknown',
          homeTeamId: match.homeTeamId,
          homeTeamName: match.homeTeam.name,
          awayTeamId: match.awayTeamId,
          awayTeamName: match.awayTeam.name,
          matchDate: match.matchDate,
          homeSetsWon: match.protocol?.homeSetsWon || 0,
          awaySetsWon: match.protocol?.awaySetsWon || 0,
          sets: setsData,
        },
      });
    }

    // Создаём запись об архивированном сезоне
    const archivedSeason = await this.prisma.archivedSeason.create({
      data: {
        seasonId: currentSeason.id,
        name: currentSeason.name,
        startDate: currentSeason.startDate,
        endDate: currentSeason.endDate,
        archivedAt: new Date(),
      },
    });

    // Деактивируем текущий сезон
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

    // Группировка по дивизионам
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

    await this.redis.set(cacheKey, matches, 3600);
    return matches;
  }

  private async calculateStandingsForArchive(division: string) {
    // Логика расчёта турнирной таблицы для архивации
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
        tournamentPoints += p.homeSetsWon === 3 ? 3 : (p.homeSetsWon === 2 ? 2 : 0);
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
        tournamentPoints += p.awaySetsWon === 3 ? 3 : (p.awaySetsWon === 2 ? 2 : 0);
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