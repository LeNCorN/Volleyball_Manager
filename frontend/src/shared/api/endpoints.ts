export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/admin/login',
        PROFILE: '/admin/profile',
        VERIFY: '/admin/verify',
        LOGOUT: '/admin/logout',
    },
    TEAMS: {
        BASE: '/teams',
        WAITING_LIST: '/teams/waiting-list',
        DETAILS: (id: string) => `/teams/${id}`,
    },
    PLAYERS: {
        BASE: '/players',
        BY_TEAM: (teamId: string) => `/players/team/${teamId}`,
        DETAILS: (id: string) => `/players/${id}`,
        UPDATE_SKILL: (id: string) => `/players/${id}/skill`,
    },
    APPLICATIONS: {
        BASE: '/applications',
        REVIEW: (id: string) => `/applications/${id}/review`,
    },
    GROUPS: {
        CONFIGURE: (division: string) => `/admin/groups/${division}`,
        STATUS: '/admin/groups/status',
    },
    STANDINGS: {
        BY_DIVISION: (division: string) => `/standings/${division}`,
    },
    MATCHES: {
        BASE: '/matches',
        DETAILS: (id: string) => `/matches/${id}`,
        BY_TEAM: (teamId: string) => `/matches/team/${teamId}`,
        PROTOCOL: (id: string) => `/admin/matches/${id}/protocol`,
    },
    SCHEDULE: {
        BASE: '/schedule',
        GENERATE: '/schedule/generate',
        CLEAR: '/schedule/clear',
    },
    SETTINGS: {
        BASE: '/tournament-settings',
        VALIDATE: '/tournament-settings/validate',
    },
    MVP: {
        RANKINGS: '/mvp/rankings',
        BY_MATCH: (matchId: string) => `/mvp/match/${matchId}`,
        VOTE: (matchId: string, teamId: string) => `/mvp/match/${matchId}/team/${teamId}/vote`,
    },
    REFEREES: {
        BASE: '/referees',
        RANKINGS: '/referees/rankings',
        RATE: (matchId: string, teamId: string) => `/referees/match/${matchId}/team/${teamId}/rate`,
    },
    DOCUMENTS: {
        BASE: '/documents',
        CATEGORIES: '/documents/categories',
        DOWNLOAD: (id: string) => `/documents/${id}/download`,
        UPLOAD: '/documents/upload',
        DETAILS: (id: string) => `/documents/${id}`,
    },
    SEASON: {
        CURRENT: '/season/current',
        ALL: '/season/all',
        STATUS: '/season/status',
        CREATE: '/season',
        ACTIVATE: (id: number) => `/season/${id}/activate`,
        CLOSE: '/season/close',
    },
    ARCHIVE: {
        SEASONS: '/archive/seasons',
        STANDINGS: (seasonId: number) => `/archive/seasons/${seasonId}/standings`,
        MATCHES: (seasonId: number) => `/archive/seasons/${seasonId}/matches`,
    },
} as const;