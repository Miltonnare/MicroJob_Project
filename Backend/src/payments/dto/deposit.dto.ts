import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MpesaDepositDto {
  @ApiProperty({ example: '+254712345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 1800 })
  @IsNumber()
  @Min(10)
  amount: number;
}
