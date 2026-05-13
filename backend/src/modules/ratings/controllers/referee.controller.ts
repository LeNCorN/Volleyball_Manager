import { Controller, Get, Post, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefereeService } from '../services/referee.service';
import { CreateRefereeRatingDto } from '../dto/create-referee-rating.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Ratings - Referees')
@Controller('referees')
export class RefereeController {
  constructor(private readonly refereeService: RefereeService) {}

  @Public()
  @Get('rankings')
  @ApiOperation({ summary: 'Get referee rankings' })
  @ApiResponse({ status: 200, description: 'Referee rankings retrieved' })
  async getRankings() {
    return this.refereeService.getRefereeRanking();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all referees' })
  async getAllReferees() {
    return this.refereeService.getAllReferees();
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new referee (Admin only)' })
  async createReferee(
    @Body() body: { fullName: string; phone?: string; email?: string },
  ) {
    return this.refereeService.createReferee(body.fullName, body.phone, body.email);
  }

  @UseGuards(AdminGuard)
  @Post('match/:matchId/team/:teamId/rate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add referee rating (Admin only)' })
  async addRating(
    @Param('matchId') matchId: string,
    @Param('teamId') teamId: string,
    @Body() dto: CreateRefereeRatingDto,
    @Req() req: any,
  ) {
    return this.refereeService.addRating(matchId, teamId, dto, req.user.id);
  }
}