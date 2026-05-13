import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TournamentSettingsService } from '../services/tournament-settings.service';
import { UpdateTournamentSettingsDto } from '../dto/update-tournament-settings.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Tournament Settings')
@Controller('tournament-settings')
export class TournamentSettingsController {
  constructor(private readonly settingsService: TournamentSettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get tournament settings' })
  @ApiResponse({ status: 200, description: 'Settings retrieved' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @UseGuards(AdminGuard)
  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tournament settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  async updateSettings(@Body() dto: UpdateTournamentSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }

  @Public()
  @Get('validate')
  @ApiOperation({ summary: 'Validate tournament settings' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validateSettings() {
    return this.settingsService.validateSettings();
  }
}