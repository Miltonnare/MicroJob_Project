import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageType } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.conversationId);
    return { status: 'joined', room: data.conversationId };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    data: {
      conversationId: string;
      senderId: string;
      content: string;
      type?: MessageType;
      attachmentUrl?: string;
    },
  ) {
    const message = await this.chatService.sendMessage(
      data.conversationId,
      data.senderId,
      data.content,
      data.type || MessageType.TEXT,
      data.attachmentUrl,
    );

    this.server.to(data.conversationId).emit('new_message', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string; userId: string; isTyping: boolean },
  ) {
    this.server.to(data.conversationId).emit('user_typing', data);
  }
}
