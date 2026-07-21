import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, ContractStatus, EscrowStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async applyToJob(workerUserId: string, jobId: string, proposedRate: number, coverLetter?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    const existingApp = await this.prisma.jobApplication.findUnique({
      where: { jobId_workerId: { jobId, workerId: workerUserId } },
    });

    if (existingApp) {
      throw new ConflictException('You have already applied to this job');
    }

    return this.prisma.jobApplication.create({
      data: {
        jobId,
        workerId: workerUserId,
        proposedRate: Number(proposedRate),
        coverLetter,
        status: ApplicationStatus.PENDING,
      },
      include: {
        job: true,
        worker: { select: { fullName: true, avatarUrl: true, phone: true } },
      },
    });
  }

  async getMyApplications(workerUserId: string) {
    return this.prisma.jobApplication.findMany({
      where: { workerId: workerUserId },
      include: {
        job: {
          include: {
            employer: { select: { fullName: true, avatarUrl: true } },
            category: true,
            county: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptApplication(employerUserId: string, applicationId: string) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.job.employerId !== employerUserId) {
      throw new ForbiddenException('You are not authorized to manage this job');
    }

    // Update application status to ACCEPTED
    await this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.ACCEPTED },
    });

    // Create Contract
    const contract = await this.prisma.contract.create({
      data: {
        jobId: application.jobId,
        employerId: employerUserId,
        workerId: application.workerId,
        totalAmount: application.proposedRate,
        status: ContractStatus.ACTIVE,
      },
    });

    // Create Escrow Account with status HELD
    const escrow = await this.prisma.escrowAccount.create({
      data: {
        contractId: contract.id,
        amount: application.proposedRate,
        status: EscrowStatus.HELD,
      },
    });

    return {
      message: 'Application accepted successfully and contract created',
      contract,
      escrow,
    };
  }
}
