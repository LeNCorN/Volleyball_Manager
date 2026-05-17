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
    const overwrite = dto?.overwrite ?? false;

    // Проверка настроек
    const settingsValid = await this.settingsService.validateSettings();
    if (!settingsValid.isValid) {
      throw new BadRequestException(`Неверные настройки турнира: ${settingsValid.errors.join(', ')}`);
    }

    // Проверка, что группы сформированы
    const season = await this.prisma.season.findUnique({ where: { id: 1 } });
    if (!season) {
      throw new BadRequestException('Сезон не настроен');
    }

    if (!season.groupsConfigured) {
      throw new BadRequestException('Группы ещё не сформированы. Сначала сформируйте группы в разделе "Лист ожидания"');
    }

    // Если overwrite=true или расписание не генерировалось, очищаем существующее расписание
    if (overwrite || !season.scheduleGenerated) {
      await this.prisma.match.deleteMany();
    }

    const settings = await this.settingsService.getSettings();
    const divisions = await this.prisma.division.findMany();

    if (divisions.length === 0) {
      throw new BadRequestException('Дивизионы не найдены');
    }

    // Получаем все возможные временные слоты
    const allTimeSlots = this.generateTimeSlots(settings);
    if (allTimeSlots.length === 0) {
      throw new BadRequestException('Не удалось создать временные слоты. Проверьте настройки дат и времени');
    }

    console.log(`Всего создано ${allTimeSlots.length} временных слотов`);

    // Собираем все матчи для всех дивизионов
    interface MatchWithDivision {
      divisionId: number;
      groupLetter: string;
      matchPair: MatchPair;
    }

    const allMatches: MatchWithDivision[] = [];

    for (const division of divisions) {
      const groups = await this.getGroupsByDivision(division.id);

      for (const group of groups) {
        if (group.teams.length < SCHEDULE_CONSTANTS.MIN_TEAMS_PER_GROUP) {
          console.warn(`Группа ${group.letter} в дивизионе ${division.name} имеет меньше ${SCHEDULE_CONSTANTS.MIN_TEAMS_PER_GROUP} команд`);
          continue;
        }

        console.log(`\n========== Генерация матчей для ${division.name} - группа ${group.letter} ==========`);
        console.log(`Команд: ${group.teams.length}`);

        const roundRobin = new RoundRobinAlgorithm();
        const matchPairs: MatchPair[] = roundRobin.generate(group.teams);

        for (const matchPair of matchPairs) {
          allMatches.push({
            divisionId: division.id,
            groupLetter: group.letter,
            matchPair,
          });
        }
      }
    }

    console.log(`\nВсего матчей для распределения: ${allMatches.length}`);

    // Перемешиваем матчи для равномерного распределения слотов между дивизионами
    for (let i = allMatches.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allMatches[i], allMatches[j]] = [allMatches[j], allMatches[i]];
    }

    // Группируем слоты по временным интервалам
    const slotsByTimeSlot = this.groupSlotsByTimeSlot(allTimeSlots);
    const sortedTimeKeys = Array.from(slotsByTimeSlot.keys()).sort();

    const scheduledMatches: ScheduledMatch[] = [];
    const usedSlots = new Set<string>();
    const teamBusyTimes = new Map<string, Set<string>>();

    let matchIndex = 0;

    for (const timeKey of sortedTimeKeys) {
      const courtSlots = slotsByTimeSlot.get(timeKey)!;
      const [dateStr, startTime] = timeKey.split('_');

      for (const slot of courtSlots) {
        if (matchIndex >= allMatches.length) break;

        const { divisionId, groupLetter, matchPair: match } = allMatches[matchIndex];
        const slotKey = `${dateStr}_${startTime}_${slot.courtNumber}`;

        if (usedSlots.has(slotKey)) continue;

        const timeSlotKey = `${dateStr}_${startTime}`;
        const homeBusy = teamBusyTimes.get(match.homeTeamId)?.has(timeSlotKey) || false;
        const awayBusy = teamBusyTimes.get(match.awayTeamId)?.has(timeSlotKey) || false;

        if (!homeBusy && !awayBusy) {
          scheduledMatches.push({
            homeTeamId: match.homeTeamId,
            homeTeamName: match.homeTeamName,
            awayTeamId: match.awayTeamId,
            awayTeamName: match.awayTeamName,
            round: match.round,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            courtNumber: slot.courtNumber,
            courtName: slot.courtName,
            divisionId,
            groupLetter,
          });

          usedSlots.add(slotKey);

          if (!teamBusyTimes.has(match.homeTeamId)) {
            teamBusyTimes.set(match.homeTeamId, new Set());
          }
          if (!teamBusyTimes.has(match.awayTeamId)) {
            teamBusyTimes.set(match.awayTeamId, new Set());
          }
          teamBusyTimes.get(match.homeTeamId)!.add(timeSlotKey);
          teamBusyTimes.get(match.awayTeamId)!.add(timeSlotKey);

          matchIndex++;
        }
      }
    }

    console.log(`\nРаспределено ${scheduledMatches.length} из ${allMatches.length} матчей`);

    // Сохраняем матчи в БД
    let savedCount = 0;
    for (const match of scheduledMatches) {
      const existingMatch = await this.prisma.match.findFirst({
        where: {
          matchDate: match.date,
          matchTime: match.startTime,
          courtNumber: match.courtNumber,
        },
      });

      if (!existingMatch) {
        try {
          await this.prisma.match.create({
            data: {
              divisionId: match.divisionId!,
              groupLetter: match.groupLetter!,
              homeTeamId: match.homeTeamId,
              awayTeamId: match.awayTeamId,
              matchDate: match.date,
              matchTime: match.startTime,
              courtNumber: match.courtNumber,
              courtName: match.courtName,
              status: 'scheduled',
            },
          });
          savedCount++;
        } catch (error) {
          console.warn(`Ошибка при создании матча: ${error.message}`);
        }
      }
    }

    if (savedCount === 0) {
      throw new BadRequestException('Не удалось сгенерировать расписание. Возможно, недостаточно временных слотов для всех матчей');
    }

    await this.prisma.season.update({
      where: { id: 1 },
      data: { scheduleGenerated: true },
    });

    await this.redis.del('schedule:all');
    await this.redis.invalidate('schedule:*');

    console.log(`\n========== ИТОГО ==========`);
    console.log(`Создано матчей: ${savedCount}`);

    return {
      message: 'Расписание успешно сгенерировано',
      matchesCount: savedCount,
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

  private groupSlotsByTimeSlot(timeSlots: TimeSlot[]): Map<string, TimeSlot[]> {
    const slotsByTimeSlot = new Map<string, TimeSlot[]>();
    for (const slot of timeSlots) {
      const timeKey = `${slot.date.toISOString().split('T')[0]}_${slot.startTime}`;
      if (!slotsByTimeSlot.has(timeKey)) {
        slotsByTimeSlot.set(timeKey, []);
      }
      slotsByTimeSlot.get(timeKey)!.push(slot);
    }
    return slotsByTimeSlot;
  }

  private generateTimeSlots(settings: any): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startDate = new Date(settings.startDate);
    const endDate = new Date(settings.endDate);

    const dayMap: Record<string, number> = {
      monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
      friday: 5, saturday: 6, sunday: 0,
    };

    const playDayNumbers = settings.playDays.map((day: string) => dayMap[day]);

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

    console.log(`Сгенерировано ${dayTimeSlots.length} временных слотов в день: ${dayTimeSlots.join(', ')}`);

    if (dayTimeSlots.length === 0) {
      return [];
    }

    const courtsCount = settings.courtsCount;
    const courtsNames = settings.courtsNames;

    console.log(`Используется ${courtsCount} площадок: ${courtsNames.join(', ')}`);

    const currentDate = new Date(startDate);
    let totalSlots = 0;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      if (playDayNumbers.includes(dayOfWeek)) {
        for (const timeSlot of dayTimeSlots) {
          for (let i = 1; i <= courtsCount; i++) {
            const slotDate = new Date(currentDate);
            const [hours, minutes] = timeSlot.split(':').map(Number);
            slotDate.setHours(hours, minutes, 0, 0);

            const endTime = new Date(slotDate);
            endTime.setMinutes(endTime.getMinutes() + matchDuration);

            slots.push({
              date: new Date(currentDate),
              startTime: timeSlot,
              endTime: endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
              courtNumber: i,
              courtName: courtsNames[i - 1] || `Площадка ${i}`,
            });
            totalSlots++;
          }
        }
        console.log(`Для даты ${currentDate.toISOString().split('T')[0]} создано ${dayTimeSlots.length * courtsCount} слотов`);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Всего создано ${totalSlots} временных слотов`);
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