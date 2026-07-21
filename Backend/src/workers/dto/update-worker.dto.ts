import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkerProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nationalId?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  yearsExperience?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  dailyRate?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  travelRadiusKm?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  emergencyAvailable?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  countyId?: string;
}
