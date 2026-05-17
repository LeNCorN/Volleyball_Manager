// frontend/src/app/routing/AppRouter.tsx

import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routePaths';
import { AdminRoute } from './AdminRoute';
import { PublicRoute } from './PublicRoute';

// Публичные страницы
import HomePage from '@pages/home';
import TournamentsPage from '@pages/tournaments';
import SchedulePage from '@pages/schedule';
import ScheduleLeaguePage from '@pages/schedule/[league]';
import ParticipantsPage from '@pages/participants';
import PlayersPage from '@pages/participants/players';
import TeamsPage from '@pages/participants/teams';
import RefereesPage from '@pages/participants/referees';
import BestPlayersPage from '@pages/participants/best-players';
import ArchivePage from '@pages/archive';
import ArchiveSeasonPage from '@pages/archive/[seasonId]';
import DocumentsPage from '@pages/documents';
import ApplyPage from '@pages/apply';
import TeamDetailsPage from '@pages/team/[id]';

// Админ страницы
import AdminLoginPage from '@pages/admin/login';
import AdminDashboardPage from '@pages/admin/dashboard';
import AdminApplicationsPage from '@pages/admin/applications';
import AdminWaitingListPage from '@pages/admin/waiting-list';
import AdminTournamentSettingsPage from '@pages/admin/tournament-settings';
import AdminScheduleGeneratorPage from '@pages/admin/schedule-generator';
import AdminMatchProtocolListPage from '@pages/admin/match-protocol';
import AdminMatchProtocolPage from '@pages/admin/match-protocol/[matchId]';
import AdminPlayersPage from '@pages/admin/players';
import AdminDocumentsPage from '@pages/admin/documents';
import AdminSeasonPage from '@pages/admin/season';
import AdminRefereesPage from '@pages/admin/referees';
import AdminMatchRefereePage from '@pages/admin/match-referee';

export const AppRouter = () => {
    return (
        <Routes>
            {/* Публичные маршруты */}
            <Route element={<PublicRoute />}>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.TOURNAMENTS} element={<TournamentsPage />} />
                <Route path={ROUTES.SCHEDULE} element={<SchedulePage />}>
                    <Route path={ROUTES.SCHEDULE_BY_LEAGUE(':league')} element={<ScheduleLeaguePage />} />
                    <Route index element={<ScheduleLeaguePage />} />
                </Route>
                <Route path={ROUTES.PARTICIPANTS} element={<ParticipantsPage />}>
                    <Route path={ROUTES.PARTICIPANTS_PLAYERS} element={<PlayersPage />} />
                    <Route path={ROUTES.PARTICIPANTS_TEAMS} element={<TeamsPage />} />
                    <Route path={ROUTES.PARTICIPANTS_REFEREES} element={<RefereesPage />} />
                    <Route path={ROUTES.PARTICIPANTS_BEST_PLAYERS} element={<BestPlayersPage />} />
                    <Route index element={<PlayersPage />} />
                </Route>
                <Route path={ROUTES.ARCHIVE} element={<ArchivePage />} />
                <Route path={ROUTES.ARCHIVE_SEASON(':seasonId')} element={<ArchiveSeasonPage />} />
                <Route path={ROUTES.DOCUMENTS} element={<DocumentsPage />} />
                <Route path={ROUTES.APPLY} element={<ApplyPage />} />
                <Route path={ROUTES.TEAM_DETAILS(':id')} element={<TeamDetailsPage />} />
            </Route>

            {/* Админ маршруты */}
            <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

            <Route element={<AdminRoute />}>
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN_APPLICATIONS} element={<AdminApplicationsPage />} />
                <Route path={ROUTES.ADMIN_WAITING_LIST} element={<AdminWaitingListPage />} />
                <Route path={ROUTES.ADMIN_TOURNAMENT_SETTINGS} element={<AdminTournamentSettingsPage />} />
                <Route path={ROUTES.ADMIN_SCHEDULE_GENERATOR} element={<AdminScheduleGeneratorPage />} />
                <Route path={ROUTES.ADMIN_MATCH_PROTOCOL_LIST} element={<AdminMatchProtocolListPage />} />
                <Route path={ROUTES.ADMIN_MATCH_PROTOCOL(':matchId')} element={<AdminMatchProtocolPage />} />
                <Route path={ROUTES.ADMIN_PLAYERS} element={<AdminPlayersPage />} />
                <Route path={ROUTES.ADMIN_DOCUMENTS} element={<AdminDocumentsPage />} />
                <Route path={ROUTES.ADMIN_SEASON} element={<AdminSeasonPage />} />
                <Route path={ROUTES.ADMIN_REFEREES} element={<AdminRefereesPage />} />
                <Route path={ROUTES.ADMIN_MATCH_REFEREE} element={<AdminMatchRefereePage />} />
            </Route>
        </Routes>
    );
};