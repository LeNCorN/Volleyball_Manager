export const CONSTANTS = {
    // Спортивные
    MAX_TEAMS_PER_GROUP: 10,
    MIN_TEAMS_PER_GROUP: 2,
    SEASON_WEEKS: 10,
    TIME_SLOTS: ['12:00', '14:00', '16:00', '18:00', '20:00'],
    COURTS: [1, 2, 3],
    PLAY_DAYS: ['saturday', 'sunday'],

    // Волейбол
    MAX_POINTS_REGULAR_SET: 25,
    MAX_POINTS_TIEBREAK: 15,
    MIN_POINTS_DIFFERENCE: 2,
    MAX_SETS: 5,

    // Кэш
    CACHE_TTL: {
        STANDINGS: 300,      // 5 минут
        TEAMS: 3600,         // 1 час
        RANKINGS: 600,       // 10 минут
        SCHEDULE: 3600,      // 1 час
    },

    // Пагинация
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
} as const;