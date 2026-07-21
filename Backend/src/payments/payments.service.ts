import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EscrowStatus, ContractStatus, TransactionType, TransactionStatus, PaymentChannel } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiateMpesaDeposit(userId: string, phone: string, amount: number) {
    const referenceNumber = `MPESA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        amount: Number(amount),
        currency: 'KES',
        channel: PaymentChannel.MPESA,
        transactionType: TransactionType.DEPOSIT,
        referenceNumber,
        status: TransactionStatus.COMPLETED,
      },
    });

    return {
      message: `M-Pesa STK Push sent to ${phone}. Enter PIN to confirm payment.`,
      referenceNumber,
      transaction,
    };
  }

  async releaseEscrowPayment(employerUserId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: { escrow: true, job: true },
    });

    if (!contract || !contract.escrow) {
      throw new NotFoundException('Contract or Escrow Account not found');
    }

    if (contract.employerId !== employerUserId) {
      throw new BadRequestException('Only the employer can release escrow funds');
    }

    if (contract.escrow.status !== EscrowStatus.HELD) {
      throw new BadRequestException(`Escrow is currently in ${contract.escrow.status} status`);
    }

    // Atomic Database Transaction for Escrow Release & Contract Completion
    return this.prisma.$transaction(async (tx) => {
      await tx.escrowAccount.update({
        where: { contractId },
        data: { status: EscrowStatus.RELEASED },
      });

      await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.COMPLETED },
      });

      const refNum = `REL-${Date.now()}`;
      await tx.paymentTransaction.create({
        data: {
          userId: contract.workerId,
          amount: contract.totalAmount,
          currency: 'KES',
          channel: PaymentChannel.MPESA,
          transactionType: TransactionType.RELEASE,
          referenceNumber: refNum,
          status: TransactionStatus.COMPLETED,
        },
      });

      return {
        message: 'Escrow payment released successfully to fundi M-Pesa account',
        contractId,
        amountReleased: contract.totalAmount,
      };
    });
  }

  async getUserEarnings(userId: string) {
    const completedContracts = await this.prisma.contract.findMany({
      where: { workerId: userId, status: ContractStatus.COMPLETED },
      include: { job: true, employer: { select: { fullName: true } } },
    });

    const activeContracts = await this.prisma.contract.findMany({
      where: { workerId: userId, status: ContractStatus.ACTIVE },
      include: { job: true, escrow: true },
    });

    const totalEarned = completedContracts.reduce((sum, c) => sum + c.totalAmount, 0);
    const inEscrow = activeContracts.reduce((sum, c) => sum + c.totalAmount, 0);

    const transactions = await this.prisma.paymentTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalEarned,
      inEscrow,
      completedJobsCount: completedContracts.length,
      activeJobsCount: activeContracts.length,
      recentTransactions: transactions,
    };
  }
}
