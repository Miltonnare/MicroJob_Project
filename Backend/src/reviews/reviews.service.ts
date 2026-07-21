import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async submitReview(
    reviewerId: string,
    data: {
      contractId: string;
      revieweeId: string;
      rating: number;
      comment?: string;
      punctualityRating?: number;
      qualityRating?: number;
      communicationRating?: number;
    },
  ) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: data.contractId },
    });

    if (!contract) throw new NotFoundException('Contract not found');

    const review = await this.prisma.review.create({
      data: {
        contractId: data.contractId,
        reviewerId,
        revieweeId: data.revieweeId,
        rating: Number(data.rating),
        comment: data.comment,
        punctualityRating: data.punctualityRating ? Number(data.punctualityRating) : 5.0,
        qualityRating: data.qualityRating ? Number(data.qualityRating) : 5.0,
        communicationRating: data.communicationRating ? Number(data.communicationRating) : 5.0,
      },
      include: {
        reviewer: { select: { fullName: true, avatarUrl: true } },
      },
    });

    // Recalculate Trust Score for reviewee worker if reviewee has a WorkerProfile
    const workerProfile = await this.prisma.workerProfile.findUnique({
      where: { userId: data.revieweeId },
    });

    if (workerProfile) {
      const allReviews = await this.prisma.review.findMany({
        where: { revieweeId: data.revieweeId },
      });

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      // Trust Score formula: (avgRating / 5) * 80 + (verification_bonus 20)
      const trustScore = Math.round((avgRating / 5) * 80 + (workerProfile.isIdVerified ? 20 : 10));

      await this.prisma.workerProfile.update({
        where: { userId: data.revieweeId },
        data: { trustScore },
      });
    }

    return review;
  }

  async getUserReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
