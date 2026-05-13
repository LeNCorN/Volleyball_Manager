import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto } from '../dto/create-team.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Tournament - Teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'List of all teams' })
  async findAll(@Query('division') division?: string) {
    return this.teamService.findAll(division);
  }

  @Public()
  @Get('waiting-list')
  @ApiOperation({ summary: 'Get waiting list' })
  async getWaitingList() {
    return this.teamService.getWaitingList();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new team (Admin only)' })
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team (Admin only)' })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete team (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}