import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Real-time Messaging & Chat')
@Controller('api/v1/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({ summary: 'Get user conversations list' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  getUserConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @ApiOperation({ summary: 'Start or get conversation with another user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('conversations')
  getOrCreateConversation(
    @CurrentUser('id') userId: string,
    @Body() body: { recipientUserId: string; jobId?: string },
  ) {
    return this.chatService.getOrCreateConversation(userId, body.recipientUserId, body.jobId);
  }

  @ApiOperation({ summary: 'Get message history for conversation' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('conversations/:id/messages')
  getMessages(@Param('id') conversationId: string, @CurrentUser('id') userId: string) {
    return this.chatService.getMessages(conversationId, userId);
  }
}
