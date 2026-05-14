import { create } from 'zustand';

export interface Player {
    id: string;
    fullName: string;
    birthDate: string;
    heightCm: number;
    position: string;
    skillLevel: string;
}

export interface Team {
    id: string;
    name: string;
    division: string;
    captainName: string;
    emblemUrl?: string;
    groupLetter?: string | null;
    isWaiting: boolean;
    players?: Player[];
}

interface TeamStore {
    teams: Team[];
    isLoading: boolean;
    selectedTeam: Team | null;
    setTeams: (teams: Team[]) => void;
    setSelectedTeam: (team: Team | null) => void;
    setLoading: (isLoading: boolean) => void;
    clearTeams: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
    teams: [],
    isLoading: false,
    selectedTeam: null,
    setTeams: (teams) => set({ teams }),
    setSelectedTeam: (selectedTeam) => set({ selectedTeam }),
    setLoading: (isLoading) => set({ isLoading }),
    clearTeams: () => set({ teams: [], selectedTeam: null }),
}));