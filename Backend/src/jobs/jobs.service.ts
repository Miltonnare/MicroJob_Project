import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BudgetType, UrgencyLevel, JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async createJob(employerId: string, data: any) {
    const job = await this.prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        employerId,
        categoryId: data.categoryId,
        budgetType: data.budgetType || BudgetType.DAILY,
        budgetAmount: Number(data.budgetAmount),
        startDate: new Date(data.startDate || Date.now()),
        endDate: data.endDate ? new Date(data.endDate) : null,
        numWorkersNeeded: data.numWorkersNeeded ? Number(data.numWorkersNeeded) : 1,
        genderPreference: data.genderPreference || 'ANY',
        experienceLevel: data.experienceLevel || 'ENTRY',
        urgency: data.urgency || UrgencyLevel.MEDIUM,
        countyId: data.countyId,
        subCountyId: data.subCountyId,
        wardId: data.wardId,
        address: data.address,
        latitude: data.latitude ? Number(data.latitude) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
        skills: {
          create: (data.skillIds || []).map((skillId: string) => ({ skillId })),
        },
      },
      include: {
        category: true,
        skills: { include: { skill: true } },
        county: true,
      },
    });

    return job;
  }

  async findAll(query: {
    countyId?: string;
    categoryId?: string;
    skillId?: string;
    urgency?: UrgencyLevel;
    status?: JobStatus;
    search?: string;
    maxBudget?: number;
  }) {
    const whereClause: any = {
      status: query.status || JobStatus.OPEN,
    };

    if (query.countyId) whereClause.countyId = query.countyId;
    if (query.categoryId) whereClause.categoryId = query.categoryId;
    if (query.urgency) whereClause.urgency = query.urgency;
    if (query.maxBudget) whereClause.budgetAmount = { lte: Number(query.maxBudget) };
    if (query.skillId) {
      whereClause.skills = { some: { skillId: query.skillId } };
    }

    if (query.search) {
      whereClause.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.job.findMany({
      where: whereClause,
      include: {
        employer: {
          select: { id: true, fullName: true, avatarUrl: true, isVerified: true },
        },
        category: true,
        county: true,
        subCounty: true,
        ward: true,
        skills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: { id: true, fullName: true, avatarUrl: true, phone: true, email: true },
        },
        category: true,
        county: true,
        subCounty: true,
        ward: true,
        skills: { include: { skill: true } },
        applications: {
          include: {
            worker: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                phone: true,
                workerProfile: {
                  include: {
                    skills: { include: { skill: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  /**
   * Intelligent Matching Algorithm for Kenya's informal workers & jobs
   * Calculates Match Score (0-100%) based on:
   * - Skill overlap weight (40%)
   * - Proximity / Haversine Distance weight (30%)
   * - Worker Trust Score & Ratings weight (20%)
   * - Budget fit & Emergency availability weight (10%)
   */
  async matchJobsForWorker(workerUserId: string) {
    const workerProfile = await this.prisma.workerProfile.findUnique({
      where: { userId: workerUserId },
      include: { skills: true },
    });

    if (!workerProfile) throw new NotFoundException('Worker profile not found');

    const workerSkillIds = new Set(workerProfile.skills.map((s) => s.skillId));
    const openJobs = await this.prisma.job.findMany({
      where: { status: JobStatus.OPEN },
      include: {
        skills: true,
        employer: { select: { fullName: true, avatarUrl: true } },
        county: true,
        category: true,
      },
    });

    const recommendations = openJobs.map((job) => {
      let skillScore = 0;
      if (job.skills.length > 0) {
        const matches = job.skills.filter((js) => workerSkillIds.has(js.skillId)).length;
        skillScore = (matches / job.skills.length) * 40;
      }

      let distanceScore = 15; // default
      if (workerProfile.latitude && workerProfile.longitude && job.latitude && job.longitude) {
        const distKm = this.calculateHaversineDistance(
          workerProfile.latitude,
          workerProfile.longitude,
          job.latitude,
          job.longitude,
        );
        if (distKm <= workerProfile.travelRadiusKm) {
          distanceScore = 30 * (1 - distKm / workerProfile.travelRadiusKm);
        } else {
          distanceScore = 5;
        }
      }

      const trustScoreWeight = (workerProfile.trustScore / 100) * 20;

      let budgetScore = 10;
      if (job.budgetAmount >= workerProfile.dailyRate) {
        budgetScore = 10;
      } else {
        budgetScore = 5;
      }

      const totalMatchScore = Math.min(
        100,
        Math.round(skillScore + distanceScore + trustScoreWeight + budgetScore),
      );

      return {
        job,
        matchScorePercent: totalMatchScore,
        skillMatchesCount: job.skills.filter((js) => workerSkillIds.has(js.skillId)).length,
      };
    });

    return recommendations.sort((a, b) => b.matchScorePercent - a.matchScorePercent);
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
