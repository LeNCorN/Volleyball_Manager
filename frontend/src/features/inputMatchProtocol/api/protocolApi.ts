import { apiClient } from '@shared/api/client';

export interface SetScore {
    homePoints: number;
    awayPoints: number;
}

export interface InputProtocolDto {
    sets: SetScore[];
    mvpHomeId?: string;
    mvpAwayId?: string;
    refereeRatingHome?: number;
    refereeRatingAway?: number;
}

export const protocolApi = {
    inputProtocol: (matchId: string, data: InputProtocolDto) => {
        return apiClient.post(`/admin/matches/${matchId}/protocol`, data);
    },
};