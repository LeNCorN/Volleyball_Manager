import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { UpdateTournamentSettingsDto } from '../dto/update-tournament-settings.dto';
import { SCHEDULE_CONSTANTS } from '../constants/schedule.constants';

@Injectable()
export class TournamentSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getSettings() {
    let settings = await this.prisma.tournamentSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await this.createDefaultSettings();
    }

    // Генерируем временные слоты на основе настроек
    const timeSlots = this.generateTimeSlotsFromSettings(settings);

    return {
      ...settings,
      timeSlots,
    };
  }

  async updateSettings(dto: UpdateTournamentSettingsDto) {
    const settings = await this.getSettings();

    // Валидация
    if (dto.courtsCount && dto.courtsCount < 1) {
      throw new BadRequestException('Минимум 1 площадка');
    }

    if (dto.courtsCount && dto.courtsNames && dto.courtsCount !== dto.courtsNames.length) {
      throw new BadRequestException('Количество названий площадок должно соответствовать количеству площадок');
    }

    const updated = await this.prisma.tournamentSettings.update({
      where: { id: 1 },
      data: {
        name: dto.name ?? settings.name,
        startDate: dto.startDate ? new Date(dto.startDate) : settings.startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : settings.endDate,
        playDays: dto.playDays ?? (settings.playDays as string[]),
        courtsCount: dto.courtsCount ?? settings.courtsCount,
        courtsNames: dto.courtsNames ?? (settings.courtsNames as string[]),
        matchDurationMinutes: dto.matchDurationMinutes ?? settings.matchDurationMinutes,
        dayStartTime: dto.dayStartTime ?? (settings as any).dayStartTime ?? SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.dayStartTime,
        dayEndTime: dto.dayEndTime ?? (settings as any).dayEndTime ?? SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.dayEndTime,
      },
    });

    await this.redis.del('tournament:settings');
    return updated;
  }

  private async createDefaultSettings() {
    // Используем upsert вместо create, чтобы избежать ошибки уникальности
    return this.prisma.tournamentSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.name,
        startDate: new Date(),
        endDate: new Date(),
        playDays: [...SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.playDays],
        courtsCount: SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.courtsCount,
        courtsNames: [...SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.courtsNames],
        matchDurationMinutes: SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.matchDurationMinutes,
        dayStartTime: SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.dayStartTime,
        dayEndTime: SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.dayEndTime,
      },
    });
  }

  private generateTimeSlotsFromSettings(settings: any): string[] {
    const startTime = settings.dayStartTime || SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.dayStartTime;
    const endTime = settings.dayEndTime || SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.dayEndTime;
    const matchDuration = settings.matchDurationMinutes || SCHEDULE_CONSTANTS.DEFAULT_SETTINGS.matchDurationMinutes;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const slots: string[] = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    while (currentHour * 60 + currentMinute + matchDuration <= endTotalMinutes) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      slots.push(timeStr);

      currentMinute += matchDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  }

  async validateSettings(): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const settings = await this.getSettings();
    const season = await this.prisma.season.findUnique({ where: { id: 1 } });

    if (!season) {
      errors.push('Сезон не настроен');
    }

    if (settings.startDate >= settings.endDate) {
      errors.push('Дата начала должна быть раньше даты окончания');
    }

    if (settings.courtsCount < 1) {
      errors.push('Минимум 1 площадка');
    }

    if (settings.courtsCount !== settings.courtsNames.length) {
      errors.push('Количество названий площадок должно соответствовать количеству площадок');
    }

    if (settings.playDays.length === 0) {
      errors.push('Должен быть выбран хотя бы один игровой день');
    }

    const timeSlots = this.generateTimeSlotsFromSettings(settings);
    if (timeSlots.length === 0) {
      errors.push('Не удалось сгенерировать временные слоты. Проверьте время начала, окончания и длительность матча');
    }

    return { isValid: errors.length === 0, errors };
  }
}