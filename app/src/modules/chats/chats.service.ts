import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '@/services/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  create({ name, members = [] }: CreateChatDto, userId: number) {
    return this.prisma.chat.create({
      data: {
        name,
        ownerId: userId,
        members: {
          create: [...members, userId].map((id) => ({ userId: id })),
        },
      },
    });
  }

  findAll(userId: number, page = 0, size = 10, term: string) {
    return this.prisma.chat.findMany({
      take: size,
      skip: page * size,
      where: term
        ? {
            name: {
              contains: term,
            },
            members: {
              some: {
                userId,
              },
            },
          }
        : {
            members: {
              some: {
                userId,
              },
            },
          },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          select: {
            user: true,
          },
        },
      },
    });
    if (!chat) return Promise.reject(new NotFoundException());
    return chat;
  }

  async update(
    id: number,
    userId: number,
    { name, members = [] }: UpdateChatDto
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });
    if (!chat) return Promise.reject(new UnauthorizedException());
    return this.prisma.chat.update({
      where: {
        id,
      },
      data: {
        name,
        members: {
          create: members.map((id) => ({ userId: id })),
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });
    if (!chat) return Promise.reject(new UnauthorizedException());
    await this.prisma.$transaction([
      this.prisma.chatMember.deleteMany({
        where: {
          chatId: id,
        },
      }),
      this.prisma.chatMessage.deleteMany({
        where: {
          chatId: id,
        },
      }),
      this.prisma.chat.delete({
        where: {
          id,
        },
      }),
    ]);
  }

  async removeMembers(id: number, userId: number, userIds: number[]) {
    const userIdsToRemove = userIds.filter((id) => id !== userId);
    const chat = await this.prisma.chat.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });
    if (!chat) return Promise.reject(new UnauthorizedException());
    return this.prisma.chatMember.deleteMany({
      where: {
        chatId: id,
        userId: {
          in: userIdsToRemove,
        },
      },
    });
  }
}
