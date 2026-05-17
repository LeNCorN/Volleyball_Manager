// backend/src/modules/stats/services/standings.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { calculateTournamentPoints } from '../utils/calculate-points.util';
import { compareTeams, sortStandings, TeamStanding } from '../utils/compare-teams.util';
import { StandingsRowDto } from '../dto/match-result.dto';

@Injectable()
export class StandingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getStandings(division: string): Promise<StandingsRowDto[]> {
    const cacheKey = `standings:${division}`;
    const cached = await this.redis.get<StandingsRowDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const standings = await this.calculateStandings(division);
    await this.redis.set(cacheKey, standings, 300);
    return standings;
  }

  private async calculateStandings(division: string): Promise<StandingsRowDto[]> {
    const divisionEntity = await this.prisma.division.findFirst({
      where: { name: division },
    });

    if (!divisionEntity) {
      return [];
    }

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

    const teamStats = new Map<string, TeamStanding>();
    const headToHeadResults = new Map<string, Map<string, string>>();

    // Инициализация статистики
    for (const team of teams) {
      teamStats.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        tournamentPoints: 0,
        setsWon: 0,
        setsLost: 0,
        pointsFor: 0,
        pointsAgainst: 0,
      });
    }

    // Подсчёт статистики для каждой команды
    for (const team of teams) {
      const stats = teamStats.get(team.id)!;

      // Домашние матчи
      for (const match of team.homeMatches) {
        const protocol = match.protocol;
        if (!protocol) continue;

        stats.setsWon += protocol.homeSetsWon;
        stats.setsLost += protocol.awaySetsWon;
        stats.pointsFor += protocol.homeTotalPoints;
        stats.pointsAgainst += protocol.awayTotalPoints;

        const points = calculateTournamentPoints(protocol.homeSetsWon, protocol.awaySetsWon);
        stats.tournamentPoints += points.homePoints;

        if (!headToHeadResults.has(team.id)) {
          headToHeadResults.set(team.id, new Map());
        }
        const winner = protocol.homeSetsWon > protocol.awaySetsWon ? team.id : match.awayTeamId;
        headToHeadResults.get(team.id)!.set(match.awayTeamId, winner);
      }

      // Гостевые матчи
      for (const match of team.awayMatches) {
        const protocol = match.protocol;
        if (!protocol) continue;

        stats.setsWon += protocol.awaySetsWon;
        stats.setsLost += protocol.homeSetsWon;
        stats.pointsFor += protocol.awayTotalPoints;
        stats.pointsAgainst += protocol.homeTotalPoints;

        const points = calculateTournamentPoints(protocol.homeSetsWon, protocol.awaySetsWon);
        stats.tournamentPoints += points.awayPoints;

        if (!headToHeadResults.has(team.id)) {
          headToHeadResults.set(team.id, new Map());
        }
        const winner = protocol.awaySetsWon > protocol.homeSetsWon ? team.id : match.homeTeamId;
        headToHeadResults.get(team.id)!.set(match.homeTeamId, winner);
      }
    }

    const sortedTeams = sortStandings(Array.from(teamStats.values()), headToHeadResults);

    const result: StandingsRowDto[] = [];
    for (let i = 0; i < sortedTeams.length; i++) {
      const team = sortedTeams[i];
      result.push({
        place: i + 1,
        teamId: team.teamId,
        teamName: team.teamName,
        matchesPlayed: await this.getMatchesPlayed(team.teamId),
        wins: await this.getWinsCount(team.teamId),
        losses: await this.getLossesCount(team.teamId),
        setsWon: team.setsWon,
        setsLost: team.setsLost,
        setsDifference: team.setsWon - team.setsLost,
        pointsFor: team.pointsFor,
        pointsAgainst: team.pointsAgainst,
        pointsDifference: team.pointsFor - team.pointsAgainst,
        tournamentPoints: team.tournamentPoints,
      });
    }

    return result;
  }

  private async getMatchesPlayed(teamId: string): Promise<number> {
    const homeCount = await this.prisma.match.count({
      where: { homeTeamId: teamId, status: 'finished' },
    });
    const awayCount = await this.prisma.match.count({
      where: { awayTeamId: teamId, status: 'finished' },
    });
    return homeCount + awayCount;
  }

  private async getWinsCount(teamId: string): Promise<number> {
    // Получаем все завершённые матчи команды
    const homeMatches = await this.prisma.match.findMany({
      where: { homeTeamId: teamId, status: 'finished' },
      include: { protocol: true },
    });

    const awayMatches = await this.prisma.match.findMany({
      where: { awayTeamId: teamId, status: 'finished' },
      include: { protocol: true },
    });

    let wins = 0;

    // Подсчёт побед в домашних матчах
    for (const match of homeMatches) {
      if (match.protocol && match.protocol.homeSetsWon > match.protocol.awaySetsWon) {
        wins++;
      }
    }

    // Подсчёт побед в гостевых матчах
    for (const match of awayMatches) {
      if (match.protocol && match.protocol.awaySetsWon > match.protocol.homeSetsWon) {
        wins++;
      }
    }

    return wins;
  }

  private async getLossesCount(teamId: string): Promise<number> {
    const matchesPlayed = await this.getMatchesPlayed(teamId);
    const wins = await this.getWinsCount(teamId);
    return matchesPlayed - wins;
  }
}