import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '@/services/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  private async findChat(chatId: number, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        members: {
          some: {
            userId,
          },
        },
      },
    });
    if (!chat) return Promise.reject(new NotFoundException());
    return chat;
  }

  async create(chatId: number, userId: number, { message }: CreateMessageDto) {
    await this.findChat(chatId, userId);
    return this.prisma.chatMessage.create({
      data: {
        message,
        chatId,
        senderId: userId,
      },
    });
  }

  findAll(chatId: number, userId: number, page = 0, size = 10, term: string) {
    return this.prisma.chatMessage.findMany({
      take: size,
      skip: page * size,
      where: term
        ? {
            chat: {
              id: chatId,
              members: {
                some: {
                  userId,
                },
              },
            },
            message: term,
          }
        : {
            chat: {
              id: chatId,
              members: {
                some: {
                  userId,
                },
              },
            },
          },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(chatId: number, userId: number, id: number) {
    await this.findChat(chatId, userId);
    const message = await this.prisma.chatMessage.findUnique({
      where: {
        id,
      },
    });
    if (!message) return Promise.reject(new NotFoundException());
    return message;
  }

  async update(
    chatId: number,
    userId: number,
    id: number,
    { message }: UpdateMessageDto
  ) {
    await this.findChat(chatId, userId);
    const currentMessage = await this.prisma.chatMessage.findFirst({
      where: {
        id,
      },
    });
    if (!currentMessage) {
      return Promise.reject(new NotFoundException());
    }
    if (currentMessage.senderId !== userId) {
      return Promise.reject(new UnauthorizedException());
    }
    return this.prisma.chatMessage.update({
      where: {
        id,
      },
      data: {
        message,
      },
    });
  }

  async remove(chatId: number, userId: number, id: number) {
    await this.findChat(chatId, userId);
    const message = await this.prisma.chatMessage.findFirst({
      where: {
        id,
      },
    });
    if (!message) {
      return Promise.reject(new NotFoundException());
    }
    if (message.senderId !== userId) {
      return Promise.reject(new UnauthorizedException());
    }
    return this.prisma.chatMessage.delete({
      where: {
        id,
      },
    });
  }
}
