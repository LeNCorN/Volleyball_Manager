// src/modules/schedule/algorithms/time-slot.allocator.ts

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
}

export class TimeSlotAllocator {
  private usedSlots: Set<string> = new Set();
  private teamAvailability: Map<string, Set<string>> = new Map();

  private getSlotKey(date: Date, startTime: string, courtNumber: number): string {
    return `${date.toISOString().split('T')[0]}_${startTime}_${courtNumber}`;
  }

  private isTeamAvailable(teamId: string, date: Date): boolean {
    const dateKey = date.toISOString().split('T')[0];
    const teamSlots = this.teamAvailability.get(teamId);
    if (!teamSlots) return true;
    return !teamSlots.has(dateKey);
  }

  private markTeamUsed(teamId: string, date: Date): void {
    const dateKey = date.toISOString().split('T')[0];
    if (!this.teamAvailability.has(teamId)) {
      this.teamAvailability.set(teamId, new Set());
    }
    this.teamAvailability.get(teamId)!.add(dateKey);
  }

  allocate(
    matches: MatchPair[],
    timeSlots: TimeSlot[],
  ): ScheduledMatch[] {
    this.usedSlots.clear();
    this.teamAvailability.clear();

    const scheduledMatches: ScheduledMatch[] = [];
    const shuffledMatches = [...matches];

    // Сортируем матчи по турам (приоритет сначала у матчей первого тура)
    shuffledMatches.sort((a, b) => a.round - b.round);

    for (const match of shuffledMatches) {
      let allocated = false;

      // Перебираем все доступные слоты
      for (const slot of timeSlots) {
        const slotKey = this.getSlotKey(slot.date, slot.startTime, slot.courtNumber);

        if (this.usedSlots.has(slotKey)) continue;

        const homeAvailable = this.isTeamAvailable(match.homeTeamId, slot.date);
        const awayAvailable = this.isTeamAvailable(match.awayTeamId, slot.date);

        if (homeAvailable && awayAvailable) {
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

          this.usedSlots.add(slotKey);
          this.markTeamUsed(match.homeTeamId, slot.date);
          this.markTeamUsed(match.awayTeamId, slot.date);
          allocated = true;
          break;
        }
      }

      if (!allocated) {
        console.warn(`Не удалось найти слот для матча: ${match.homeTeamName} vs ${match.awayTeamName}`);
      }
    }

    return scheduledMatches;
  }
}