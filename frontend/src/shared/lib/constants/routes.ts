export const ROUTES = {
    // Публичные
    HOME: '/',
    TOURNAMENTS: '/tournaments',
    SCHEDULE: '/schedule',
    SCHEDULE_BY_LEAGUE: (league: string) => `/schedule/${league}`,
    PARTICIPANTS: '/participants',
    PARTICIPANTS_PLAYERS: '/participants/players',
    PARTICIPANTS_TEAMS: '/participants/teams',
    PARTICIPANTS_REFEREES: '/participants/referees',
    PARTICIPANTS_BEST_PLAYERS: '/participants/best-players',
    ARCHIVE: '/archive',
    ARCHIVE_SEASON: (seasonId: string | number) => `/archive/${seasonId}`,
    DOCUMENTS: '/documents',
    APPLY: '/apply',
    TEAM_DETAILS: (id: string) => `/team/${id}`,

    // Админ
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_APPLICATIONS: '/admin/applications',
    ADMIN_WAITING_LIST: '/admin/waiting-list',
    ADMIN_TOURNAMENT_SETTINGS: '/admin/tournament-settings',
    ADMIN_SCHEDULE_GENERATOR: '/admin/schedule-generator',
    ADMIN_MATCH_PROTOCOL: (matchId: string) => `/admin/match-protocol/${matchId}`,
    ADMIN_PLAYERS: '/admin/players',
    ADMIN_DOCUMENTS: '/admin/documents',
    ADMIN_SEASON: '/admin/season',
} as const;