import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StandingsService } from '../services/standings.service';
import { Public } from '../../../common/decorators/public.decorator';
import { StandingsRowDto } from '../dto/match-result.dto';

@ApiTags('Stats - Standings')
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Public()
  @Get(':division')
  @ApiOperation({ summary: 'Get tournament standings by division' })
  @ApiResponse({ status: 200, description: 'Standings retrieved', type: [StandingsRowDto] })
  async getStandings(@Param('division') division: string): Promise<StandingsRowDto[]> {
    return this.standingsService.getStandings(division);
  }
}