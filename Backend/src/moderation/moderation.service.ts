import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const totalUsers = await this.prisma.user.count();
    const totalWorkers = await this.prisma.user.count({ where: { role: 'WORKER' } });
    const totalEmployers = await this.prisma.user.count({ where: { role: 'EMPLOYER' } });
    const totalJobs = await this.prisma.job.count();
    const activeContracts = await this.prisma.contract.count({ where: { status: 'ACTIVE' } });
    const completedContracts = await this.prisma.contract.count({ where: { status: 'COMPLETED' } });
    
    const escrowHeld = await this.prisma.escrowAccount.aggregate({
      where: { status: 'HELD' },
      _sum: { amount: true },
    });

    const totalVolume = await this.prisma.paymentTransaction.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    });

    return {
      totalUsers,
      totalWorkers,
      totalEmployers,
      totalJobs,
      activeContracts,
      completedContracts,
      escrowVolumeHeld: escrowHeld._sum.amount || 0,
      totalTransactionVolume: totalVolume._sum.amount || 0,
    };
  }

  async getReports() {
    return this.prisma.report.findMany({
      include: {
        reporter: { select: { fullName: true, email: true } },
        reportedUser: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyWorkerId(workerUserId: string) {
    await this.prisma.user.update({
      where: { id: workerUserId },
      data: { isVerified: true },
    });

    return this.prisma.workerProfile.update({
      where: { userId: workerUserId },
      data: { isIdVerified: true, trustScore: 95.0 },
    });
  }
}
