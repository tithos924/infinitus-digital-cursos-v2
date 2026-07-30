import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findRecent() {
    const messages = await this.prisma.chatMessage.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });
    return messages.reverse();
  }

  async create(userId: string, dto: CreateMessageDto) {
    return this.prisma.chatMessage.create({
      data: { userId, content: dto.content.slice(0, 2000) },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });
  }
}
