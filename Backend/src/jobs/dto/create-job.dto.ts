import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BudgetType, UrgencyLevel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Masonry Perimeter Wall Repair' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Looking for 2 experienced masons to repair stone wall and plaster.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ enum: BudgetType, default: BudgetType.DAILY })
  @IsEnum(BudgetType)
  @IsOptional()
  budgetType?: BudgetType;

  @ApiProperty({ example: 1800 })
  @IsNumber()
  @Min(100)
  budgetAmount: number;

  @ApiProperty({ enum: UrgencyLevel, default: UrgencyLevel.MEDIUM })
  @IsEnum(UrgencyLevel)
  @IsOptional()
  urgency?: UrgencyLevel;

  @ApiProperty()
  @IsString()
  @IsOptional()
  countyId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  skillIds?: string[];
}
