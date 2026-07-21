import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role, UrgencyLevel, JobStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Jobs & Intelligent Matching Engine')
@Controller('api/v1/jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @ApiOperation({ summary: 'Post a new job opportunity' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.CONTRACTOR, Role.ADMIN)
  @Post()
  createJob(@CurrentUser('id') employerId: string, @Body() data: any) {
    return this.jobsService.createJob(employerId, data);
  }

  @ApiOperation({ summary: 'Search and filter open jobs' })
  @Get()
  findAll(
    @Query('countyId') countyId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('skillId') skillId?: string,
    @Query('urgency') urgency?: UrgencyLevel,
    @Query('status') status?: JobStatus,
    @Query('search') search?: string,
    @Query('maxBudget') maxBudget?: number,
  ) {
    return this.jobsService.findAll({
      countyId,
      categoryId,
      skillId,
      urgency,
      status,
      search,
      maxBudget,
    });
  }

  @ApiOperation({ summary: 'Get intelligent job recommendations tailored for the authenticated worker' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('match/recommendations')
  getRecommendations(@CurrentUser('id') workerUserId: string) {
    return this.jobsService.matchJobsForWorker(workerUserId);
  }

  @ApiOperation({ summary: 'Get job details by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
}
