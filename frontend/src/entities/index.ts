// Team
export {
    TeamCard,
    TeamAvatar,
    TeamBadge,
    useTeamStore,
    useTeamById,
    teamApi,
    getDivisionLabel,
    getDivisionColor,
    calculateAverageHeight,
    calculateAverageAge,
} from './team';

export type { Team, Player, CreateTeamDto, UpdateTeamDto } from './team';

// Player
export {
    PlayerCard,
    PlayerRow,
    PlayerAvatar,
    usePlayerStore,
    usePlayerById,
    playerApi,
    getPositionLabel,
    getSkillLevelLabel,
    getSkillLevelColor,
    calculateAge,
} from './player';

export type { PlayerFilters, CreatePlayerDto, UpdatePlayerDto } from './player';

// Match
export {
    MatchCard,
    MatchRow,
    MatchStatusBadge,
    useMatchById,
    matchApi,
    getMatchStatusLabel,
    formatMatchResult,
} from './match';

// Document
export {
    DocumentCard,
    DocumentCategoryBadge,
    useDocuments,
    documentApi,
    formatFileSize,
} from './document';

// Экспортируем тип из document
export type { UpdateDocumentDto } from './document/api/documentApi';

// Referee
export {
    RefereeCard,
    RefereeRankingRow,
    useRefereeRanking,
    useReferees,
    refereeApi,
    getScoreLabel,
} from './referee';

export type { CreateRefereeDto } from './referee';

// TournamentSettings
export {
    useTournamentSettings,
    useUpdateTournamentSettings,
    useValidateSettings,
    settingsApi,
} from './tournamentSettings';

export type { UpdateSettingsDto } from './tournamentSettings';

// Season
export {
    useCurrentSeason,
    useAllSeasons,
    useSeasonStatus,
    useCreateSeason,
    useCloseSeason,
    seasonApi,
} from './season';

export type { CreateSeasonDto } from './season';

// Application
export {
    useApplications,
    useApplicationById,
    useCreateApplication,
    useReviewApplication,
    applicationApi,
} from './application';

export type { CreateApplicationDto, ReviewApplicationDto } from './application';