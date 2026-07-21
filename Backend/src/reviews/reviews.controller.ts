import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reputation, Ratings & Reviews')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Submit rating and review for completed job contract' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  submitReview(
    @CurrentUser('id') reviewerId: string,
    @Body()
    body: {
      contractId: string;
      revieweeId: string;
      rating: number;
      comment?: string;
      punctualityRating?: number;
      qualityRating?: number;
      communicationRating?: number;
    },
  ) {
    return this.reviewsService.submitReview(reviewerId, {
      ...body,
    });
  }

  @ApiOperation({ summary: 'Get reviews received by user' })
  @Get('user/:userId')
  getUserReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserReviews(userId);
  }
}
