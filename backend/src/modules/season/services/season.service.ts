// src/modules/season/services/season.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { CreateSeasonDto } from '../dto/create-season.dto';
import { ArchiveService } from './archive.service';

@Injectable()
export class SeasonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly archiveService: ArchiveService,
  ) {}

  async getCurrentSeason() {
    const cacheKey = 'season:current';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const season = await this.prisma.season.findFirst({
      where: { isActive: true },
    });

    if (!season) {
      throw new NotFoundException('Активный сезон не найден');
    }

    const settings = await this.prisma.tournamentSettings.findUnique({
      where: { id: 1 },
    });

    const result = {
      ...season,
      settings,
    };

    await this.redis.set(cacheKey, result, 3600);
    return result;
  }

  async getAllSeasons() {
    const cacheKey = 'season:all';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const seasons = await this.prisma.season.findMany({
      orderBy: { id: 'desc' },
    });

    await this.redis.set(cacheKey, seasons, 3600);
    return seasons;
  }

  async createSeason(dto: CreateSeasonDto) {
    // Проверяем, есть ли уже активный сезон
    const activeSeason = await this.prisma.season.findFirst({
      where: { isActive: true },
    });

    if (activeSeason) {
      throw new BadRequestException('Активный сезон уже существует. Сначала завершите текущий сезон.');
    }

    const season = await this.prisma.season.create({
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        weeksCount: dto.weeksCount || 10,
        isActive: true,
      },
    });

    // Обновляем настройки турнира с новыми датами
    await this.prisma.tournamentSettings.update({
      where: { id: 1 },
      data: {
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        scheduleGenerated: false,
        groupsConfigured: false,
      },
    });

    await this.invalidateCache();

    return season;
  }

  async switchToSeason(seasonId: number) {
    const targetSeason = await this.prisma.season.findUnique({
      where: { id: seasonId },
    });

    if (!targetSeason) {
      throw new NotFoundException(`Сезон с ID ${seasonId} не найден`);
    }

    // Деактивируем все сезоны
    await this.prisma.season.updateMany({
      where: {},
      data: { isActive: false },
    });

    // Активируем выбранный сезон
    const activated = await this.prisma.season.update({
      where: { id: seasonId },
      data: { isActive: true },
    });

    // Обновляем настройки турнира
    await this.prisma.tournamentSettings.update({
      where: { id: 1 },
      data: {
        startDate: targetSeason.startDate,
        endDate: targetSeason.endDate,
        scheduleGenerated: targetSeason.scheduleGenerated,
        groupsConfigured: targetSeason.groupsConfigured,
      },
    });

    await this.invalidateCache();

    return activated;
  }

  async getSeasonStatus() {
    const currentSeason = await this.getCurrentSeason();

    const teamsCount = await this.prisma.team.count();
    const matchesCount = await this.prisma.match.count();
    const finishedMatchesCount = await this.prisma.match.count({
      where: { status: 'finished' },
    });
    const applicationsCount = await this.prisma.teamApplication.count();

    const totalMatches = matchesCount;
    const completedMatches = finishedMatchesCount;
    const completionPercentage = totalMatches > 0
      ? Math.round((completedMatches / totalMatches) * 100)
      : 0;

    return {
      season: currentSeason,
      stats: {
        teamsCount,
        matchesCount: totalMatches,
        finishedMatchesCount: completedMatches,
        completionPercentage,
        applicationsCount,
      },
    };
  }

  private async invalidateCache() {
    await this.redis.del('season:current');
    await this.redis.del('season:all');
  }
}