import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SeasonService } from '../services/season.service';
import { ArchiveService } from '../services/archive.service';
import { CreateSeasonDto } from '../dto/create-season.dto';
import { CloseSeasonDto } from '../dto/close-season.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Season')
@Controller('season')
export class SeasonController {
  constructor(
    private readonly seasonService: SeasonService,
    private readonly archiveService: ArchiveService,
  ) {}

  @Public()
  @Get('current')
  @ApiOperation({ summary: 'Get current season' })
  async getCurrentSeason() {
    return this.seasonService.getCurrentSeason();
  }

  @Public()
  @Get('all')
  @ApiOperation({ summary: 'Get all seasons' })
  async getAllSeasons() {
    return this.seasonService.getAllSeasons();
  }

  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get season status with statistics' })
  async getSeasonStatus() {
    return this.seasonService.getSeasonStatus();
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new season (Admin only)' })
  async createSeason(@Body() dto: CreateSeasonDto) {
    return this.seasonService.createSeason(dto);
  }

  @UseGuards(AdminGuard)
  @Post(':id/activate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Switch to a specific season (Admin only)' })
  async switchToSeason(@Param('id') id: string) {
    return this.seasonService.switchToSeason(parseInt(id));
  }

  @UseGuards(AdminGuard)
  @Post('close')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close current season and archive results (Admin only)' })
  async closeSeason(@Body() dto: CloseSeasonDto) {
    if (dto.archiveResults) {
      return this.archiveService.archiveCurrentSeason();
    }
    return { message: 'Сезон закрыт без архивации' };
  }
}