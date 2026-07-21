import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Job Applications & Contracting')
@Controller('api/v1/applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'Apply to a job opportunity as a Fundi' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  applyToJob(
    @CurrentUser('id') workerUserId: string,
    @Body() body: { jobId: string; proposedRate: number; coverLetter?: string },
  ) {
    return this.applicationsService.applyToJob(
      workerUserId,
      body.jobId,
      body.proposedRate,
      body.coverLetter,
    );
  }

  @ApiOperation({ summary: 'Get current worker applications' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-applications')
  getMyApplications(@CurrentUser('id') workerUserId: string) {
    return this.applicationsService.getMyApplications(workerUserId);
  }

  @ApiOperation({ summary: 'Accept a worker application and initiate contract & escrow' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  acceptApplication(
    @CurrentUser('id') employerUserId: string,
    @Param('id') applicationId: string,
  ) {
    return this.applicationsService.acceptApplication(employerUserId, applicationId);
  }
}
