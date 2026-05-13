import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MatchService } from '../services/match.service';
import { Public } from '../../../common/decorators/public.decorator';
import { MatchResultDto } from '../dto/match-result.dto';

@ApiTags('Stats - Matches')
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, description: 'Matches retrieved', type: [MatchResultDto] })
  async getMatches(
    @Query('division') division?: string,
    @Query('status') status?: string,
  ): Promise<MatchResultDto[]> {
    return this.matchService.getMatches(division, status);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiResponse({ status: 200, description: 'Match retrieved', type: MatchResultDto })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async getMatchById(@Param('id') id: string): Promise<MatchResultDto | null> {
    return this.matchService.getMatchById(id);
  }

  @Public()
  @Get('team/:teamId')
  @ApiOperation({ summary: 'Get matches by team ID' })
  @ApiResponse({ status: 200, description: 'Matches retrieved', type: [MatchResultDto] })
  async getMatchesByTeam(@Param('teamId') teamId: string): Promise<MatchResultDto[]> {
    return this.matchService.getMatchesByTeam(teamId);
  }
}