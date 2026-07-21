import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Locations & Skills System')
@Controller('api/v1/locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @ApiOperation({ summary: 'Get all 47 Kenyan Counties' })
  @Get('counties')
  getCounties() {
    return this.locationsService.getCounties();
  }

  @ApiOperation({ summary: 'Get Sub-Counties and Wards for a given County' })
  @Get('counties/:countyId/subcounties')
  getSubCounties(@Param('countyId') countyId: string) {
    return this.locationsService.getSubCounties(countyId);
  }

  @ApiOperation({ summary: 'Get all Job Categories and Informal Trade Skills' })
  @Get('categories')
  getCategories() {
    return this.locationsService.getCategoriesWithSkills();
  }
}
