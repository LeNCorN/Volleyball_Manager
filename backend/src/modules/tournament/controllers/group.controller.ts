import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroupService } from '../services/group.service';
import { ConfigureGroupsDto } from '../dto/configure-groups.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Tournament - Groups')
@Controller('admin/groups')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post(':division')
  @ApiOperation({ summary: 'Configure groups for a division' })
  async configureGroups(
    @Param('division') division: string,
    @Body() dto: ConfigureGroupsDto,
  ) {
    return this.groupService.configureGroups(division, dto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get groups configuration status' })
  async getStatus() {
    return this.groupService.getGroupsStatus();
  }
}