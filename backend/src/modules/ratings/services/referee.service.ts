import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { CreateRefereeRatingDto } from '../dto/create-referee-rating.dto';
import { calculateFinalScore } from '../utils/calculate-referee-score.util';

@Injectable()
export class RefereeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async addRating(matchId: string, ratingTeamId: string, dto: CreateRefereeRatingDto, adminId: string) {
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
      throw new BadRequestException('Оценка судье доступна только для завершённых матчей');
    }

    // Проверяем, что оценивающая команда участвовала в матче
    if (ratingTeamId !== match.homeTeamId && ratingTeamId !== match.awayTeamId) {
      throw new BadRequestException('Команда не участвовала в этом матче');
    }

    // Проверяем, что судья действительно обслуживал этот матч
    if (match.refereeId !== dto.refereeId) {
      throw new BadRequestException('Указанный судья не обслуживал этот матч');
    }

    // Проверяем, не оценивала ли уже эта команда судью
    const existingRating = await this.prisma.refereeRating.findUnique({
      where: {
        matchId_ratingTeamId: {
          matchId,
          ratingTeamId,
        },
      },
    });

    if (existingRating) {
      throw new BadRequestException('Эта команда уже оценила судью в этом матче');
    }

    // Создаём оценку
    const rating = await this.prisma.refereeRating.create({
      data: {
        matchId,
        ratingTeamId,
        refereeId: dto.refereeId,
        score: dto.score,
        createdById: adminId,
      },
    });

    // Обновляем агрегированную статистику судьи
    await this.updateRefereeAggregatedStats(dto.refereeId);

    // Инвалидируем кэш рейтинга судей
    await this.redis.del('rankings:referees');

    return rating;
  }

  private async updateRefereeAggregatedStats(refereeId: string) {
    const ratings = await this.prisma.refereeRating.findMany({
      where: { refereeId },
      include: {
        ratingTeam: true,
      },
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

    const finalScore = calculateFinalScore({
      averageScore,
      matchesCount,
      uniqueTeamsCount,
    });

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

  async getRefereeRanking() {
    const cacheKey = 'rankings:referees';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const referees = await this.prisma.referee.findMany({
      include: {
        aggregated: true,
        ratings: {
          include: {
            ratingTeam: true,
          },
        },
      },
    });

    const ranking = referees
      .map(referee => {
        const agg = referee.aggregated;
        if (!agg || agg.matchesCount === 0) return null;

        // Получаем количество разных команд, оценивших судью
        const uniqueTeams = new Set(referee.ratings.map(r => r.ratingTeamId));
        const uniqueTeamsCount = uniqueTeams.size;

        // Распределение оценок
        const scoreDistribution = {
          5: agg.score5Count,
          4: agg.score4Count,
          3: agg.score3Count,
          2: agg.score2Count,
        };

        return {
          id: referee.id,
          fullName: referee.fullName,
          matchesCount: agg.matchesCount,
          score5: agg.score5Count,
          score4: agg.score4Count,
          score3: agg.score3Count,
          score2: agg.score2Count,
          averageScore: Number(agg.averageScore.toFixed(2)),
          uniqueTeamsCount,
          finalScore: agg.finalScore,
          scoreDistribution,
        };
      })
      .filter(ref => ref !== null)
      .sort((a, b) => b!.finalScore - a!.finalScore);

    await this.redis.set(cacheKey, ranking, 600); // 10 минут

    return ranking;
  }

  async getAllReferees() {
    const referees = await this.prisma.referee.findMany({
      orderBy: { fullName: 'asc' },
    });
    return referees;
  }

  async createReferee(fullName: string, phone?: string, email?: string) {
    const referee = await this.prisma.referee.create({
      data: {
        fullName,
        phone,
        email,
      },
    });
    return referee;
  }
}