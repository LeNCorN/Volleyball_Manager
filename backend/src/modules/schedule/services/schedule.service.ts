// src/modules/schedule/services/schedule.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { RoundRobinAlgorithm } from '../algorithms/round-robin.algorithm';
import { TimeSlotAllocator, TimeSlot, ScheduledMatch, MatchPair } from '../algorithms/time-slot.allocator';
import { TournamentSettingsService } from './tournament-settings.service';
import { GenerateScheduleDto } from '../dto/generate-schedule.dto';
import { SCHEDULE_CONSTANTS } from '../constants/schedule.constants';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly settingsService: TournamentSettingsService,
  ) {}

  async generateSchedule(dto: GenerateScheduleDto) {
    // Проверка настроек
    const settingsValid = await this.settingsService.validateSettings();
    if (!settingsValid.isValid) {
      throw new BadRequestException(`Неверные настройки турнира: ${settingsValid.errors.join(', ')}`);
    }

    // Проверка, что группы сформированы
    const season = await this.prisma.season.findUnique({ where: { id: 1 } });
    if (!season?.groupsConfigured) {
      throw new BadRequestException('Группы ещё не сформированы');
    }

    // Проверка, не сгенерировано ли уже расписание
    if (season.scheduleGenerated && !dto.overwrite) {
      throw new BadRequestException('Расписание уже сгенерировано. Используйте overwrite=true для перегенерации');
    }

    // Если overwrite=true, очищаем существующее расписание
    if (dto.overwrite) {
      await this.prisma.match.deleteMany();
    }

    const settings = await this.settingsService.getSettings();
    const divisions = await this.prisma.division.findMany();

    const allScheduledMatches: ScheduledMatch[] = [];

    for (const division of divisions) {
      const groups = await this.getGroupsByDivision(division.id);

      for (const group of groups) {
        if (group.teams.length < SCHEDULE_CONSTANTS.MIN_TEAMS_PER_GROUP) {
          console.warn(`Группа ${group.letter} в дивизионе ${division.name} имеет меньше ${SCHEDULE_CONSTANTS.MIN_TEAMS_PER_GROUP} команд`);
          continue;
        }

        // Генерация пар матчей по круговой системе
        const roundRobin = new RoundRobinAlgorithm();
        const matchPairs: MatchPair[] = roundRobin.generate(group.teams);

        // Создание временных слотов
        const timeSlots = this.generateTimeSlots(settings);

        // Распределение по слотам
        const allocator = new TimeSlotAllocator();
        const scheduledMatches = allocator.allocate(matchPairs, timeSlots);

        // Сохранение матчей в БД
        for (const match of scheduledMatches) {
          const savedMatch = await this.prisma.match.create({
            data: {
              divisionId: division.id,
              groupLetter: group.letter,
              homeTeamId: match.homeTeamId,
              awayTeamId: match.awayTeamId,
              matchDate: match.date,
              matchTime: match.startTime,
              courtNumber: match.courtNumber,
              courtName: match.courtName,
              status: 'scheduled',
            },
          });
          allScheduledMatches.push({ ...match, matchId: savedMatch.id });
        }
      }
    }

    // Обновляем флаг генерации расписания
    await this.prisma.season.update({
      where: { id: 1 },
      data: { scheduleGenerated: true },
    });

    // Инвалидируем кэш
    await this.redis.del('schedule:all');
    await this.redis.invalidate('schedule:*');

    return {
      message: 'Расписание успешно сгенерировано',
      matchesCount: allScheduledMatches.length,
      matches: allScheduledMatches,
    };
  }

  async getSchedule(division?: string, group?: string) {
    const cacheKey = `schedule:${division || 'all'}:${group || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (division) {
      const divisionEntity = await this.prisma.division.findFirst({
        where: { name: division },
      });
      if (divisionEntity) {
        where.divisionId = divisionEntity.id;
      }
    }
    if (group) {
      where.groupLetter = group;
    }

    const matches = await this.prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        division: true,
        protocol: true,
      },
      orderBy: [{ matchDate: 'asc' }, { matchTime: 'asc' }],
    });

    const result = matches.map(m => ({
      id: m.id,
      division: m.division.name,
      group: m.groupLetter,
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      date: m.matchDate,
      time: m.matchTime,
      court: m.courtName || `Площадка ${m.courtNumber}`,
      status: m.status,
      result: m.protocol ? `${m.protocol.homeSetsWon}:${m.protocol.awaySetsWon}` : null,
    }));

    await this.redis.set(cacheKey, result, 3600);
    return result;
  }

  private async getGroupsByDivision(divisionId: number) {
    const teams = await this.prisma.team.findMany({
      where: {
        divisionId,
        isWaiting: false,
        groupLetter: { not: null },
      },
      select: {
        id: true,
        name: true,
        groupLetter: true,
      },
    });

    const groupsMap = new Map<string, Array<{ id: string; name: string }>>();
    for (const team of teams) {
      const letter = team.groupLetter!;
      if (!groupsMap.has(letter)) {
        groupsMap.set(letter, []);
      }
      groupsMap.get(letter)!.push({ id: team.id, name: team.name });
    }

    return Array.from(groupsMap.entries()).map(([letter, teams]) => ({
      letter,
      teams,
    }));
  }

  private generateTimeSlots(settings: any): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startDate = new Date(settings.startDate);
    const endDate = new Date(settings.endDate);

    // Сопоставление дней недели
    const dayMap: Record<string, number> = {
      monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
      friday: 5, saturday: 6, sunday: 0,
    };

    const playDayNumbers = settings.playDays.map((day: string) => dayMap[day]);

    // Генерация временных слотов на основе настроек
    const matchDuration = settings.matchDurationMinutes;
    const [startHour, startMinute] = (settings.dayStartTime || '10:00').split(':').map(Number);
    const [endHour, endMinute] = (settings.dayEndTime || '22:00').split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const dayTimeSlots: string[] = [];
    let currentMinutes = startTotalMinutes;

    while (currentMinutes + matchDuration <= endTotalMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const minute = currentMinutes % 60;
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      dayTimeSlots.push(timeStr);
      currentMinutes += matchDuration;
    }

    if (dayTimeSlots.length === 0) {
      throw new BadRequestException('Некорректные настройки времени. Проверьте время начала, окончания и длительность матча');
    }

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      if (playDayNumbers.includes(dayOfWeek)) {
        for (const timeSlot of dayTimeSlots) {
          const [hours, minutes] = timeSlot.split(':').map(Number);
          const slotDate = new Date(currentDate);
          slotDate.setHours(hours, minutes, 0, 0);

          const endTime = new Date(slotDate);
          endTime.setMinutes(endTime.getMinutes() + matchDuration);

          for (let i = 1; i <= settings.courtsCount; i++) {
            slots.push({
              date: new Date(currentDate),
              startTime: timeSlot,
              endTime: endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
              courtNumber: i,
              courtName: settings.courtsNames[i - 1] || `Площадка ${i}`,
            });
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  async clearSchedule() {
    await this.prisma.match.deleteMany();
    await this.prisma.season.update({
      where: { id: 1 },
      data: { scheduleGenerated: false },
    });
    await this.redis.invalidate('schedule:*');
    return { message: 'Расписание успешно очищено' };
  }
}