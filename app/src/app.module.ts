import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ChatsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
