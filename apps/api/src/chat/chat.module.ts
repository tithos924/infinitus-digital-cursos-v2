import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
