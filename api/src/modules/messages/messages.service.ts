import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '@/services/prisma.service';
import { VaultService } from '@/services/vault.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vault: VaultService
  ) {}

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

  async create(chatId: number, userId: number, dto: CreateMessageDto) {
    const { encrypted } = await this.findChat(chatId, userId);
    if (encrypted) {
      dto.message = await this.vault.encrypt(dto.message);
    }
    const { message } = dto;

    return this.prisma.chatMessage.create({
      data: {
        message,
        chatId,
        senderId: userId,
      },
    });
  }

  async findAll(
    chatId: number,
    userId: number,
    page = 0,
    size = 10,
    term: string
  ) {
    const chat = await this.findChat(chatId, userId);
    const results = await this.prisma.chatMessage.findMany({
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
    return Promise.all(
      results.map(async (result) => {
        if (chat.encrypted) {
          result.message = await this.vault.decrypt(result.message);
        }
        return Promise.resolve(result);
      })
    );
  }

  async findOne(chatId: number, userId: number, id: number) {
    const { encrypted } = await this.findChat(chatId, userId);
    const messageRecord = await this.prisma.chatMessage.findUnique({
      where: {
        id,
      },
    });
    if (!messageRecord) return Promise.reject(new NotFoundException());
    if (encrypted) {
      messageRecord.message = await this.vault.decrypt(messageRecord.message);
    }

    return messageRecord;
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
