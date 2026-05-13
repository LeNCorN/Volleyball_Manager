import { Controller, Get, Post, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MvpService } from '../services/mvp.service';
import { CreateMvpVoteDto } from '../dto/create-mvp-vote.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Ratings - MVP')
@Controller('mvp')
export class MvpController {
  constructor(private readonly mvpService: MvpService) {}

  @Public()
  @Get('rankings')
  @ApiOperation({ summary: 'Get MVP rankings' })
  @ApiResponse({ status: 200, description: 'MVP rankings retrieved' })
  async getRankings() {
    return this.mvpService.getMvpRanking();
  }

  @Public()
  @Get('match/:matchId')
  @ApiOperation({ summary: 'Get MVP votes for a match' })
  async getMatchVotes(@Param('matchId') matchId: string) {
    return this.mvpService.getMatchVotes(matchId);
  }

  @UseGuards(AdminGuard)
  @Post('match/:matchId/team/:teamId/vote')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add MVP vote (Admin only)' })
  async addVote(
    @Param('matchId') matchId: string,
    @Param('teamId') teamId: string,
    @Body() dto: CreateMvpVoteDto,
    @Req() req: any,
  ) {
    return this.mvpService.addVote(matchId, teamId, dto, req.user.id);
  }
}