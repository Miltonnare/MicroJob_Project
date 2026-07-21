import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('JobsService Unit Suite', () => {
  let service: JobsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    job: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    workerProfile: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate matching score based on distance, trust score, and skills', async () => {
    mockPrismaService.workerProfile.findUnique.mockResolvedValue({
      id: 'worker-1',
      userId: 'user-1',
      trustScore: 90,
      travelRadiusKm: 20,
      dailyRate: 1500,
      latitude: -0.0917,
      longitude: 34.768,
      skills: [{ skillId: 'skill-mason' }],
    });

    mockPrismaService.job.findMany.mockResolvedValue([
      {
        id: 'job-1',
        title: 'Stone Wall Repair',
        budgetAmount: 1800,
        latitude: -0.095,
        longitude: 34.762,
        skills: [{ skillId: 'skill-mason' }],
        employer: { fullName: 'Employer Test', avatarUrl: null },
        category: { name: 'Masonry' },
      },
    ]);

    const result = await service.matchJobsForWorker('user-1');

    expect(result).toHaveLength(1);
    expect(result[0].matchScorePercent).toBeGreaterThanOrEqual(70);
    expect(result[0].skillMatchesCount).toBe(1);
  });
});
