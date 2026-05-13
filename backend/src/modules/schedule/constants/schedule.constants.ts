export const SCHEDULE_CONSTANTS = {
  DEFAULT_SETTINGS: {
    name: 'Чемпионат по волейболу',
    playDays: ['saturday', 'sunday'],
    courtsCount: 3,
    courtsNames: ['Площадка 1', 'Площадка 2', 'Площадка 3'],
    timeSlots: [], // Будет генерироваться динамически из dayStartTime/dayEndTime
    matchDurationMinutes: 90,
    dayStartTime: '10:00',
    dayEndTime: '22:00',
  },
  MAX_TEAMS_PER_GROUP: 10,
  MIN_TEAMS_PER_GROUP: 2,
  DAYS_OF_WEEK: {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
  },
} as const;