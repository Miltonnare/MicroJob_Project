import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getUserConversations(userId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            job: { select: { title: true } },
            participants: {
              include: {
                user: {
                  select: { id: true, fullName: true, avatarUrl: true, role: true },
                },
              },
            },
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });

    return participants.map((p) => p.conversation);
  }

  async getOrCreateConversation(userId: string, recipientUserId: string, jobId?: string) {
    // Check if conversation already exists between these users
    const existing = await this.prisma.conversation.findFirst({
      where: {
        jobId: jobId || undefined,
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: recipientUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
      },
    });

    if (existing) return existing;

    // Create new conversation
    return this.prisma.conversation.create({
      data: {
        jobId,
        participants: {
          create: [{ userId }, { userId: recipientUserId }],
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async getMessages(conversationId: string, userId: string) {
    const isParticipant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!isParticipant) {
      throw new ForbiddenException('Not a participant in this conversation');
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: MessageType = MessageType.TEXT,
    attachmentUrl?: string,
  ) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        type,
        attachmentUrl,
      },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}
