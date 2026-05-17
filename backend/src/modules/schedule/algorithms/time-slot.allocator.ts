// backend/src/modules/schedule/algorithms/time-slot.allocator.ts

export interface TimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
  courtNumber: number;
  courtName: string;
}

export interface MatchPair {
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  round: number;
}

export interface ScheduledMatch {
  matchId?: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  round: number;
  date: Date;
  startTime: string;
  endTime: string;
  courtNumber: number;
  courtName: string;
  divisionId?: number;
  groupLetter?: string;
}

export class TimeSlotAllocator {
  allocate(matches: MatchPair[], timeSlots: TimeSlot[], existingUsedSlots: Set<string> = new Set()): ScheduledMatch[] {
    const scheduledMatches: ScheduledMatch[] = [];
    const usedSlots: Set<string> = new Set(existingUsedSlots);
    const teamBusyTimes: Map<string, Set<string>> = new Map();

    // Группируем слоты по временному интервалу (дата + время)
    const slotsByTimeSlot = new Map<string, TimeSlot[]>();
    for (const slot of timeSlots) {
      const timeKey = `${slot.date.toISOString().split('T')[0]}_${slot.startTime}`;
      if (!slotsByTimeSlot.has(timeKey)) {
        slotsByTimeSlot.set(timeKey, []);
      }
      slotsByTimeSlot.get(timeKey)!.push(slot);
    }

    // Сортируем временные интервалы
    const sortedTimeKeys = Array.from(slotsByTimeSlot.keys()).sort();

    // Копия матчей
    const remainingMatches = [...matches];
    let matchIndex = 0;

    // Перебираем временные интервалы
    for (const timeKey of sortedTimeKeys) {
      const courtSlots = slotsByTimeSlot.get(timeKey)!;
      const [dateStr, startTime] = timeKey.split('_');

      // Для каждого временного интервала пытаемся заполнить ВСЕ доступные площадки
      for (const slot of courtSlots) {
        if (matchIndex >= remainingMatches.length) break;

        const match = remainingMatches[matchIndex];
        const slotKey = `${dateStr}_${startTime}_${slot.courtNumber}`;

        // Проверяем, не занят ли слот
        if (usedSlots.has(slotKey)) continue;

        // Проверяем, не заняты ли команды в это время
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

    console.log(`Распределено ${scheduledMatches.length} из ${matches.length} матчей`);
    return scheduledMatches;
  }
}