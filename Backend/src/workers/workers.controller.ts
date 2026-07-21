import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Worker Profiles & Directory')
@Controller('api/v1/workers')
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @ApiOperation({ summary: 'Search and filter fundis (by County, Skill, Emergency status, Daily rate)' })
  @Get()
  findAll(
    @Query('countyId') countyId?: string,
    @Query('skillId') skillId?: string,
    @Query('emergencyOnly') emergencyOnly?: boolean,
    @Query('search') search?: string,
    @Query('maxDailyRate') maxDailyRate?: number,
  ) {
    return this.workersService.findAll({
      countyId,
      skillId,
      emergencyOnly: emergencyOnly ? String(emergencyOnly) === 'true' : undefined,
      search,
      maxDailyRate,
    });
  }

  @ApiOperation({ summary: 'Get current authenticated worker profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.workersService.getMyProfile(userId);
  }

  @ApiOperation({ summary: 'Update current worker profile (rates, location, emergency toggle, portfolio)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile/me')
  updateProfile(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.workersService.updateProfile(userId, data);
  }

  @ApiOperation({ summary: 'Add or update skill for current worker profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('profile/me/skills')
  addSkill(
    @CurrentUser('id') userId: string,
    @Body() body: { skillId: string; yearsExperience: number; proficiencyLevel: string },
  ) {
    return this.workersService.addSkill(
      userId,
      body.skillId,
      body.yearsExperience || 1,
      body.proficiencyLevel || 'INTERMEDIATE',
    );
  }

  @ApiOperation({ summary: 'Get worker profile by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(id);
  }
}
