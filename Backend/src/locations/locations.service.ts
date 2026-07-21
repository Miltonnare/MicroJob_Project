import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getCounties() {
    return this.prisma.county.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { workers: true, jobs: true } },
      },
    });
  }

  async getSubCounties(countyId: string) {
    return this.prisma.subCounty.findMany({
      where: { countyId },
      orderBy: { name: 'asc' },
      include: { wards: true },
    });
  }

  async getCategoriesWithSkills() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        skills: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }
}
