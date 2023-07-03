import { Module } from '@nestjs/common';

import { PrismaService } from '@/services/prisma.service';
import { VaultService } from '@/services/vault.service';
import { ConfigService } from '@nestjs/config';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, VaultService, ConfigService],
})
export class MessagesModule {}
