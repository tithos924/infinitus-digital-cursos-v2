import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (!dto.content?.trim() && !dto.audioUrl) {
      throw new BadRequestException('A mensagem precisa de texto ou áudio');
    }
    return this.prisma.chatMessage.create({
      data: {
        userId,
        content: dto.content?.slice(0, 2000),
        audioUrl: dto.audioUrl,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
    });
  }

  async remove(messageId: string, userId: string, role: string) {
    const message = await this.prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message) throw new NotFoundException('Mensagem não encontrada');
    if (message.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Sem permissão para apagar esta mensagem');
    }
    return this.prisma.chatMessage.delete({ where: { id: messageId } });
  }
}
