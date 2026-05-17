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
        homeTeam: {
          include: {
            players: true,  // Добавляем игроков команды хозяев
          },
        },
        awayTeam: {
          include: {
            players: true,  // Добавляем игроков команды гостей
          },
        },
        division: true,
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
        homeTeam: {
          include: {
            players: true,  // Добавляем игроков команды хозяев
          },
        },
        awayTeam: {
          include: {
            players: true,  // Добавляем игроков команды гостей
          },
        },
        division: true,
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
        homeTeam: {
          include: {
            players: true,
          },
        },
        awayTeam: {
          include: {
            players: true,
          },
        },
        division: true,
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

    const formattedDate = match.matchDate ? new Date(match.matchDate).toLocaleDateString('ru-RU') : '—';
    const formattedTime = match.matchTime ? match.matchTime.substring(0, 5) : '—';

    // Форматируем список игроков для выбора MVP
    const homePlayers = match.homeTeam?.players?.map((player: any) => ({
      id: player.id,
      fullName: player.fullName,
    })) || [];

    const awayPlayers = match.awayTeam?.players?.map((player: any) => ({
      id: player.id,
      fullName: player.fullName,
    })) || [];

    return {
      id: match.id,
      matchId: match.id,
      division: match.division?.name || 'unknown',
      divisionName: match.division?.name === 'light' ? 'Лайт-лига' : 'Хард-лига',
      homeTeamId: match.homeTeamId,
      homeTeamName: match.homeTeam?.name || 'Неизвестно',
      homePlayers,  // Добавляем список игроков хозяев
      awayTeamId: match.awayTeamId,
      awayTeamName: match.awayTeam?.name || 'Неизвестно',
      awayPlayers,  // Добавляем список игроков гостей
      matchDate: match.matchDate,
      matchDateFormatted: formattedDate,
      matchTime: formattedTime,
      courtNumber: match.courtNumber,
      courtName: match.courtName || `Площадка ${match.courtNumber}`,
      status: match.status,
      sets,
      homeSetsWon,
      awaySetsWon,
      winnerTeamId,
      winnerTeamName,
      result: match.protocol ? `${homeSetsWon}:${awaySetsWon}` : null,
      refereeId: match.refereeId,
    };
  }
}