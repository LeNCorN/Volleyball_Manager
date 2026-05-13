import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlayerService } from '../services/player.service';
import { CreatePlayerDto, UpdatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerSkillDto } from '../dto/update-player-skill.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Tournament - Players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all players with filters' })
  async findAll(
    @Query('division') division?: string,
    @Query('position') position?: string,
    @Query('skillLevel') skillLevel?: string,
    @Query('search') search?: string,
    @Query('teamId') teamId?: string,
  ) {
    return this.playerService.findAll({ division, position, skillLevel, search, teamId });
  }

  @Public()
  @Get('team/:teamId')
  @ApiOperation({ summary: 'Get players by team ID' })
  async getPlayersByTeam(@Param('teamId') teamId: string) {
    return this.playerService.getPlayersByTeam(teamId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get player by ID' })
  async findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new player (Admin only)' })
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update player (Admin only)' })
  async update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(id, updatePlayerDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/skill')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update player skill level (Admin only)' })
  async updateSkillLevel(
    @Param('id') id: string,
    @Body() updateDto: UpdatePlayerSkillDto,
  ) {
    return this.playerService.updateSkillLevel(id, updateDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete player (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.playerService.remove(id);
  }
}