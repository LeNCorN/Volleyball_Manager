import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArchiveService } from '../services/archive.service';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Archive')
@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Public()
  @Get('seasons')
  @ApiOperation({ summary: 'Get all archived seasons' })
  async getArchivedSeasons() {
    return this.archiveService.getArchivedSeasons();
  }

  @Public()
  @Get('seasons/:seasonId/standings')
  @ApiOperation({ summary: 'Get archived standings by season' })
  async getArchivedStandings(@Param('seasonId') seasonId: string) {
    return this.archiveService.getArchivedStandings(parseInt(seasonId));
  }

  @Public()
  @Get('seasons/:seasonId/matches')
  @ApiOperation({ summary: 'Get archived matches by season' })
  async getArchivedMatches(
    @Param('seasonId') seasonId: string,
    @Query('division') division?: string,
  ) {
    return this.archiveService.getArchivedMatches(parseInt(seasonId), division);
  }
}