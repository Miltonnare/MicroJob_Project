import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    countyId?: string;
    skillId?: string;
    emergencyOnly?: boolean;
    search?: string;
    maxDailyRate?: number;
    minRating?: number;
  }) {
    const whereClause: any = {
      isAvailable: true,
    };

    if (query.countyId) {
      whereClause.countyId = query.countyId;
    }

    if (query.emergencyOnly) {
      whereClause.emergencyAvailable = true;
    }

    if (query.maxDailyRate) {
      whereClause.dailyRate = { lte: Number(query.maxDailyRate) };
    }

    if (query.skillId) {
      whereClause.skills = {
        some: { skillId: query.skillId },
      };
    }

    if (query.search) {
      whereClause.user = {
        fullName: { contains: query.search, mode: 'insensitive' },
      };
    }

    return this.prisma.workerProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        county: true,
        subCounty: true,
        ward: true,
        skills: {
          include: { skill: true },
        },
        badges: {
          include: { badge: true },
        },
      },
      orderBy: { trustScore: 'desc' },
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.workerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        county: true,
        subCounty: true,
        ward: true,
        skills: { include: { skill: true } },
        badges: { include: { badge: true } },
      },
    });

    if (!profile) {
      throw new NotFoundException('Worker profile not found');
    }

    return profile;
  }

  async getMyProfile(userId: string) {
    const profile = await this.prisma.workerProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        county: true,
        subCounty: true,
        ward: true,
        skills: { include: { skill: true } },
        badges: { include: { badge: true } },
      },
    });

    if (!profile) {
      throw new NotFoundException('Worker profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Worker profile not found');
    }

    return this.prisma.workerProfile.update({
      where: { userId },
      data: {
        bio: data.bio,
        nationalId: data.nationalId,
        yearsExperience: data.yearsExperience ? Number(data.yearsExperience) : undefined,
        hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : undefined,
        dailyRate: data.dailyRate ? Number(data.dailyRate) : undefined,
        travelRadiusKm: data.travelRadiusKm ? Number(data.travelRadiusKm) : undefined,
        emergencyAvailable: data.emergencyAvailable !== undefined ? Boolean(data.emergencyAvailable) : undefined,
        countyId: data.countyId,
        subCountyId: data.subCountyId,
        wardId: data.wardId,
        latitude: data.latitude ? Number(data.latitude) : undefined,
        longitude: data.longitude ? Number(data.longitude) : undefined,
        languages: data.languages,
        portfolioPhotos: data.portfolioPhotos,
      },
    });
  }

  async addSkill(userId: string, skillId: string, yearsExperience: number, proficiencyLevel: string) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    return this.prisma.workerSkill.upsert({
      where: {
        workerProfileId_skillId: { workerProfileId: profile.id, skillId },
      },
      update: { yearsExperience, proficiencyLevel },
      create: {
        workerProfileId: profile.id,
        skillId,
        yearsExperience,
        proficiencyLevel,
      },
    });
  }
}
