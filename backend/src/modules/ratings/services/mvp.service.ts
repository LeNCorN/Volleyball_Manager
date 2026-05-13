import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { CreateMvpVoteDto } from '../dto/create-mvp-vote.dto';

@Injectable()
export class MvpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async addVote(matchId: string, voterTeamId: string, dto: CreateMvpVoteDto, adminId: string) {
    // Проверяем существование матча
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${matchId} не найден`);
    }

    // Проверяем, что матч завершён
    if (match.status !== 'finished') {
      throw new BadRequestException('Голосование MVP доступно только для завершённых матчей');
    }

    // Проверяем, что голосующая команда участвовала в матче
    if (voterTeamId !== match.homeTeamId && voterTeamId !== match.awayTeamId) {
      throw new BadRequestException('Команда не участвовала в этом матче');
    }

    // Проверяем, что выбранный игрок действительно играет в команде-сопернике
    const opponentTeamId = voterTeamId === match.homeTeamId ? match.awayTeamId : match.homeTeamId;

    const player = await this.prisma.player.findFirst({
      where: {
        id: dto.mvpPlayerId,
        teamId: opponentTeamId,
      },
    });

    if (!player) {
      throw new BadRequestException('MVP можно выбрать только из состава команды-соперника');
    }

    // Проверяем, не голосовала ли уже эта команда
    const existingVote = await this.prisma.mVPVote.findUnique({
      where: {
        matchId_voterTeamId: {
          matchId,
          voterTeamId,
        },
      },
    });

    if (existingVote) {
      throw new BadRequestException('Эта команда уже проголосовала за MVP в этом матче');
    }

    // Создаём голос
    const vote = await this.prisma.mVPVote.create({
      data: {
        matchId,
        voterTeamId,
        mvpPlayerId: dto.mvpPlayerId,
        createdById: adminId,
      },
      include: {
        mvpPlayer: {
          include: {
            team: true,
          },
        },
      },
    });

    // Инвалидируем кэш рейтинга MVP
    await this.redis.del('rankings:mvp');

    return vote;
  }

  async getMvpRanking() {
    const cacheKey = 'rankings:mvp';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    // Получаем всех игроков с количеством полученных голосов MVP
    const players = await this.prisma.player.findMany({
      include: {
        team: {
          include: {
            division: true,
          },
        },
        receivedMVP: true,
      },
    });

    const ranking = players
      .map(player => ({
        id: player.id,
        fullName: player.fullName,
        teamId: player.teamId,
        teamName: player.team?.name || 'Нет команды',
        division: player.team?.division?.name || null,
        mvpCount: player.receivedMVP.length,
      }))
      .filter(player => player.mvpCount > 0)
      .sort((a, b) => b.mvpCount - a.mvpCount);

    await this.redis.set(cacheKey, ranking, 600); // 10 минут

    return ranking;
  }

  async getMatchVotes(matchId: string) {
    const votes = await this.prisma.mVPVote.findMany({
      where: { matchId },
      include: {
        voterTeam: true,
        mvpPlayer: {
          include: {
            team: true,
          },
        },
      },
    });

    return votes.map(vote => ({
      voterTeamId: vote.voterTeamId,
      voterTeamName: vote.voterTeam.name,
      mvpPlayerId: vote.mvpPlayerId,
      mvpPlayerName: vote.mvpPlayer.fullName,
      mvpPlayerTeam: vote.mvpPlayer.team?.name,
    }));
  }
}