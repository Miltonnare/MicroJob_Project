import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin & Moderation Portal')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MODERATOR)
export class ModerationController {
  constructor(private moderationService: ModerationService) {}

  @ApiOperation({ summary: 'Get high-level platform analytics and escrow metrics' })
  @ApiBearerAuth()
  @Get('stats')
  getStats() {
    return this.moderationService.getPlatformStats();
  }

  @ApiOperation({ summary: 'Get list of dispute reports and flagged accounts' })
  @ApiBearerAuth()
  @Get('reports')
  getReports() {
    return this.moderationService.getReports();
  }

  @ApiOperation({ summary: 'Approve National ID verification for a worker' })
  @ApiBearerAuth()
  @Post('verify-worker/:userId')
  verifyWorker(@Param('userId') userId: string) {
    return this.moderationService.verifyWorkerId(userId);
  }
}
