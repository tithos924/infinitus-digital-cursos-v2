import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat/messages')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  findRecent() {
    return this.chatService.findRecent();
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateMessageDto) {
    return this.chatService.create(user.sub, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.chatService.remove(id, user.sub, user.role);
  }
}
