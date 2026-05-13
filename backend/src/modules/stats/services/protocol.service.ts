import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { InputProtocolDto } from '../dto/input-protocol.dto';
import { SetValidator } from '../validators/set.validator';
import { calculateTournamentPoints } from '../utils/calculate-points.util';

@Injectable()
export class ProtocolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async inputProtocol(matchId: string, dto: InputProtocolDto, adminId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    if (match.status === 'finished') {
      throw new BadRequestException('Match already finished');
    }

    // Валидация сетов
    const validation = SetValidator.validateFullMatch(dto.sets);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors);
    }

    // Сохранение сетов
    await this.prisma.matchSet.deleteMany({ where: { matchId } });
    for (let i = 0; i < dto.sets.length; i++) {
      await this.prisma.matchSet.create({
        data: {
          matchId,
          setNumber: i + 1,
          homePoints: dto.sets[i].homePoints,
          awayPoints: dto.sets[i].awayPoints,
        },
      });
    }

    // Сохранение протокола
    const protocol = await this.prisma.matchProtocol.upsert({
      where: { matchId },
      update: {
        homeSetsWon: validation.homeSetsWon,
        awaySetsWon: validation.awaySetsWon,
        homeTotalPoints: validation.homeTotalPoints,
        awayTotalPoints: validation.awayTotalPoints,
        isValidated: true,
        validatedById: adminId,
        validatedAt: new Date(),
      },
      create: {
        matchId,
        homeSetsWon: validation.homeSetsWon,
        awaySetsWon: validation.awaySetsWon,
        homeTotalPoints: validation.homeTotalPoints,
        awayTotalPoints: validation.awayTotalPoints,
        isValidated: true,
        validatedById: adminId,
        validatedAt: new Date(),
      },
    });

    // Обновление статуса матча
    await this.prisma.match.update({
      where: { id: matchId },
      data: { status: 'finished' },
    });

    // Сохранение MVP голосов
    if (dto.mvpHomeId) {
      await this.prisma.mVPVote.create({
        data: {
          matchId,
          voterTeamId: match.homeTeamId,
          mvpPlayerId: dto.mvpHomeId,
          createdById: adminId,
        },
      });
    }

    if (dto.mvpAwayId) {
      await this.prisma.mVPVote.create({
        data: {
          matchId,
          voterTeamId: match.awayTeamId,
          mvpPlayerId: dto.mvpAwayId,
          createdById: adminId,
        },
      });
    }

    // Сохранение оценок судьи
    if (dto.refereeRatingHome && match.refereeId) {
      await this.prisma.refereeRating.create({
        data: {
          matchId,
          ratingTeamId: match.homeTeamId,
          refereeId: match.refereeId,
          score: dto.refereeRatingHome,
          createdById: adminId,
        },
      });
    }

    if (dto.refereeRatingAway && match.refereeId) {
      await this.prisma.refereeRating.create({
        data: {
          matchId,
          ratingTeamId: match.awayTeamId,
          refereeId: match.refereeId,
          score: dto.refereeRatingAway,
          createdById: adminId,
        },
      });
    }

    // Обновление агрегированной статистики судьи
    if (match.refereeId) {
      await this.updateRefereeAggregatedStats(match.refereeId);
    }

    // Инвалидация кэша
    await this.invalidateStandingsCache(match.divisionId);

    return {
      matchId,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      result: `${validation.homeSetsWon}:${validation.awaySetsWon}`,
      homeSetsWon: validation.homeSetsWon,
      awaySetsWon: validation.awaySetsWon,
      homeTotalPoints: validation.homeTotalPoints,
      awayTotalPoints: validation.awayTotalPoints,
      tournamentPoints: calculateTournamentPoints(validation.homeSetsWon, validation.awaySetsWon),
    };
  }

  private async updateRefereeAggregatedStats(refereeId: string) {
    const ratings = await this.prisma.refereeRating.findMany({
      where: { refereeId },
      include: { ratingTeam: true },
    });

    const matchesCount = ratings.length;
    const score5Count = ratings.filter(r => r.score === 5).length;
    const score4Count = ratings.filter(r => r.score === 4).length;
    const score3Count = ratings.filter(r => r.score === 3).length;
    const score2Count = ratings.filter(r => r.score === 2).length;

    const averageScore = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0;

    const uniqueTeams = new Set(ratings.map(r => r.ratingTeamId));
    const uniqueTeamsCount = uniqueTeams.size;

    const finalScore = (averageScore * 20) + (matchesCount * 0.5) + (uniqueTeamsCount * 0.3);

    await this.prisma.refereeRatingAggregated.upsert({
      where: { refereeId },
      update: {
        matchesCount,
        score5Count,
        score4Count,
        score3Count,
        score2Count,
        averageScore,
        uniqueTeamsCount,
        finalScore,
      },
      create: {
        refereeId,
        matchesCount,
        score5Count,
        score4Count,
        score3Count,
        score2Count,
        averageScore,
        uniqueTeamsCount,
        finalScore,
      },
    });
  }

  private async invalidateStandingsCache(divisionId: number) {
    const division = await this.prisma.division.findUnique({
      where: { id: divisionId },
    });
    if (division) {
      await this.redis.del(`standings:${division.name}`);
    }
  }
}