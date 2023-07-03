import { configuration } from '@config';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';

import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    ChatsModule,
    MessagesModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      load: configuration,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
