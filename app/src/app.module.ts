import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ChatsModule, MessagesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
