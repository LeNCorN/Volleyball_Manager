import { ApiProperty } from '@nestjs/swagger';

export class SetResultDto {
  @ApiProperty()
  homePoints: number;

  @ApiProperty()
  awayPoints: number;

  @ApiProperty()
  winner: 'home' | 'away';
}

export class PlayerInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;
}

export class MatchResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  matchId: string;

  @ApiProperty()
  division: string;

  @ApiProperty()
  divisionName: string;

  @ApiProperty()
  homeTeamId: string;

  @ApiProperty()
  homeTeamName: string;

  @ApiProperty({ type: [PlayerInfoDto] })
  homePlayers: PlayerInfoDto[];

  @ApiProperty()
  awayTeamId: string;

  @ApiProperty()
  awayTeamName: string;

  @ApiProperty({ type: [PlayerInfoDto] })
  awayPlayers: PlayerInfoDto[];

  @ApiProperty()
  matchDate: Date;

  @ApiProperty()
  matchDateFormatted: string;

  @ApiProperty()
  matchTime: string;

  @ApiProperty()
  courtNumber: number;

  @ApiProperty()
  courtName: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [SetResultDto] })
  sets: SetResultDto[];

  @ApiProperty()
  homeSetsWon: number;

  @ApiProperty()
  awaySetsWon: number;

  @ApiProperty()
  winnerTeamId: string | null;

  @ApiProperty()
  winnerTeamName: string | null;

  @ApiProperty()
  result: string | null;

  @ApiProperty()
  refereeId: string | null;
}

export class StandingsRowDto {
  @ApiProperty()
  place: number;

  @ApiProperty()
  teamId: string;

  @ApiProperty()
  teamName: string;

  @ApiProperty()
  matchesPlayed: number;

  @ApiProperty()
  wins: number;

  @ApiProperty()
  losses: number;

  @ApiProperty()
  setsWon: number;

  @ApiProperty()
  setsLost: number;

  @ApiProperty()
  setsDifference: number;

  @ApiProperty()
  pointsFor: number;

  @ApiProperty()
  pointsAgainst: number;

  @ApiProperty()
  pointsDifference: number;

  @ApiProperty()
  tournamentPoints: number;
}