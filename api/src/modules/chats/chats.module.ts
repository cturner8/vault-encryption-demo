import { Module } from '@nestjs/common';

import { PrismaService } from '@/services/prisma.service';
import { VaultService } from '@/services/vault.service';
import { ConfigService } from '@nestjs/config';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService, VaultService, ConfigService],
})
export class ChatsModule {}
