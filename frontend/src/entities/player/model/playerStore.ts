import { create } from 'zustand';

export interface Player {
    id: string;
    fullName: string;
    birthDate: string;
    age: number;
    heightCm: number;
    position: string;
    skillLevel: string;
    teamId: string;
    teamName: string;
    division: string;
    mvpCount?: number;
}

interface PlayerStore {
    players: Player[];
    isLoading: boolean;
    selectedPlayer: Player | null;
    setPlayers: (players: Player[]) => void;
    setSelectedPlayer: (player: Player | null) => void;
    setLoading: (isLoading: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    players: [],
    isLoading: false,
    selectedPlayer: null,
    setPlayers: (players) => set({ players }),
    setSelectedPlayer: (selectedPlayer) => set({ selectedPlayer }),
    setLoading: (isLoading) => set({ isLoading }),
}));