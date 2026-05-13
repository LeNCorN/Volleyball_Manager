import { ApiProperty } from '@nestjs/swagger';

export class SetResultDto {
  @ApiProperty()
  homePoints: number;
  awayPoints: number;
  winner: 'home' | 'away';
}

export class MatchResultDto {
  @ApiProperty()
  matchId: string;

  @ApiProperty()
  homeTeamId: string;

  @ApiProperty()
  homeTeamName: string;

  @ApiProperty()
  awayTeamId: string;

  @ApiProperty()
  awayTeamName: string;

  @ApiProperty()
  matchDate: Date;

  @ApiProperty()
  matchTime: string;

  @ApiProperty()
  courtNumber: number;

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