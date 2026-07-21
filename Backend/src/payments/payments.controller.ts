import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Escrow Payments & M-Pesa Integration')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Initiate M-Pesa STK Push Deposit' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('mpesa/deposit')
  initiateMpesaDeposit(
    @CurrentUser('id') userId: string,
    @Body() body: { phone: string; amount: number },
  ) {
    return this.paymentsService.initiateMpesaDeposit(userId, body.phone, body.amount);
  }

  @ApiOperation({ summary: 'Release Escrow funds to worker upon job completion' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('escrow/release/:contractId')
  releaseEscrowPayment(
    @CurrentUser('id') employerUserId: string,
    @Param('contractId') contractId: string,
  ) {
    return this.paymentsService.releaseEscrowPayment(employerUserId, contractId);
  }

  @ApiOperation({ summary: 'Get earnings dashboard and transaction history' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('earnings/dashboard')
  getUserEarnings(@CurrentUser('id') userId: string) {
    return this.paymentsService.getUserEarnings(userId);
  }
}
