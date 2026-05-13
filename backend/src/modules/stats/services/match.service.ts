import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MatchResultDto, SetResultDto } from '../dto/match-result.dto';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async getMatches(division?: string, status?: string): Promise<MatchResultDto[]> {
    const where: any = {};

    if (division) {
      const divisionEntity = await this.prisma.division.findFirst({
        where: { name: division },
      });
      if (divisionEntity) {
        where.divisionId = divisionEntity.id;
      }
    }

    if (status) {
      where.status = status;
    }

    const matches = await this.prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        sets: {
          orderBy: { setNumber: 'asc' },
        },
        protocol: true,
      },
      orderBy: { matchDate: 'asc' },
    });

    return matches.map(match => this.mapToMatchResultDto(match));
  }

  async getMatchById(id: string): Promise<MatchResultDto | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        sets: {
          orderBy: { setNumber: 'asc' },
        },
        protocol: true,
      },
    });

    if (!match) {
      return null;
    }

    return this.mapToMatchResultDto(match);
  }

  async getMatchesByTeam(teamId: string): Promise<MatchResultDto[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        sets: {
          orderBy: { setNumber: 'asc' },
        },
        protocol: true,
      },
      orderBy: { matchDate: 'asc' },
    });

    return matches.map(match => this.mapToMatchResultDto(match));
  }

  private mapToMatchResultDto(match: any): MatchResultDto {
    const sets: SetResultDto[] = match.sets.map((set: any) => ({
      homePoints: set.homePoints,
      awayPoints: set.awayPoints,
      winner: set.homePoints > set.awayPoints ? 'home' : 'away',
    }));

    let homeSetsWon = 0;
    let awaySetsWon = 0;
    let winnerTeamId: string | null = null;
    let winnerTeamName: string | null = null;

    if (match.protocol) {
      homeSetsWon = match.protocol.homeSetsWon;
      awaySetsWon = match.protocol.awaySetsWon;

      if (homeSetsWon > awaySetsWon) {
        winnerTeamId = match.homeTeamId;
        winnerTeamName = match.homeTeam.name;
      } else if (awaySetsWon > homeSetsWon) {
        winnerTeamId = match.awayTeamId;
        winnerTeamName = match.awayTeam.name;
      }
    }

    return {
      matchId: match.id,
      homeTeamId: match.homeTeamId,
      homeTeamName: match.homeTeam.name,
      awayTeamId: match.awayTeamId,
      awayTeamName: match.awayTeam.name,
      matchDate: match.matchDate,
      matchTime: match.matchTime,
      courtNumber: match.courtNumber,
      status: match.status,
      sets,
      homeSetsWon,
      awaySetsWon,
      winnerTeamId,
      winnerTeamName,
    };
  }
}