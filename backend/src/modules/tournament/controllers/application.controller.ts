import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ReviewApplicationDto } from '../dto/review-application.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Tournament - Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a team application (public)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  async create(@Body() createDto: CreateApplicationDto) {
    return this.applicationService.create(createDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications (Admin only)' })
  async findAll(@Query('status') status?: string) {
    return this.applicationService.findAll(status);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application by ID (Admin only)' })
  async findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/review')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Review application (approve/reject)' })
  async review(
    @Param('id') id: string,
    @Body() reviewDto: ReviewApplicationDto,
    @Req() req: any,
  ) {
    return this.applicationService.review(id, reviewDto, req.user.id);
  }
}