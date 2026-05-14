// UI Components
export { TeamCard } from './ui/TeamCard';
export { TeamAvatar } from './ui/TeamAvatar';
export { TeamBadge } from './ui/TeamBadge';

// Model (Store & Hooks)
export { useTeamStore } from './model/teamStore';
export { useTeamById } from './model/useTeamById';

// API
export { teamApi } from './api/teamApi';

// Lib (Utils)
export {
    getDivisionLabel,
    getDivisionColor,
    calculateAverageHeight,
    calculateAverageAge,
} from './lib/teamUtils';

// Types
export type { Team, Player } from './model/teamStore';
export type { CreateTeamDto, UpdateTeamDto } from './api/teamApi';