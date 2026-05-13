import { Controller, Post, Body, Req, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProtocolService } from '../services/protocol.service';
import { InputProtocolDto } from '../dto/input-protocol.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Stats - Protocols')
@Controller('admin/matches')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ProtocolController {
  constructor(private readonly protocolService: ProtocolService) {}

  @Post(':id/protocol')
  @ApiOperation({ summary: 'Input match protocol (Admin only)' })
  @ApiResponse({ status: 200, description: 'Protocol saved successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  @ApiResponse({ status: 400, description: 'Invalid protocol data' })
  async inputProtocol(
    @Param('id') id: string,
    @Body() dto: InputProtocolDto,
    @Req() req: any,
  ) {
    return this.protocolService.inputProtocol(id, dto, req.user.id);
  }
}