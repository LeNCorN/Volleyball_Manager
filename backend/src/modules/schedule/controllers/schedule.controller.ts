import { Controller, Get, Post, Delete, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleService } from '../services/schedule.service';
import { GenerateScheduleDto } from '../dto/generate-schedule.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get schedule' })
  @ApiResponse({ status: 200, description: 'Schedule retrieved' })
  async getSchedule(
    @Query('division') division?: string,
    @Query('group') group?: string,
  ) {
    return this.scheduleService.getSchedule(division, group);
  }

  @UseGuards(AdminGuard)
  @Post('generate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate schedule (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schedule generated' })
  @ApiResponse({ status: 400, description: 'Cannot generate schedule' })
  async generateSchedule(@Query() dto: GenerateScheduleDto) {
    return this.scheduleService.generateSchedule(dto);
  }

  @UseGuards(AdminGuard)
  @Delete('clear')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear schedule (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schedule cleared' })
  async clearSchedule() {
    return this.scheduleService.clearSchedule();
  }
}