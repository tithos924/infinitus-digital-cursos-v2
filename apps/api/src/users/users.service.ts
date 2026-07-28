import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, bio: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Utilizador não encontrado');
    return user;
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, bio: true },
    });
  }

  async myEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async myCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
