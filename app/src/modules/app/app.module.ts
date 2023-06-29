import { Module } from '@nestjs/common';
import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ChatsModule, MessagesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
