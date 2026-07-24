import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async listStudents() {
    return this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        enrollments: {
          select: { course: { select: { id: true, title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createStudent(dto: CreateStudentDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Este email já está registado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const student = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: 'STUDENT',
      },
    });

    if (dto.courseIds?.length) {
      await this.prisma.enrollment.createMany({
        data: dto.courseIds.map((courseId) => ({ userId: student.id, courseId })),
        skipDuplicates: true,
      });
    }

    return { id: student.id, name: student.name, email: student.email };
  }

  async grantAccess(studentId: string, courseId: string) {
    await this.assertStudentExists(studentId);
    return this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: studentId, courseId } },
      update: {},
      create: { userId: studentId, courseId },
    });
  }

  async revokeAccess(studentId: string, courseId: string) {
    await this.assertStudentExists(studentId);
    return this.prisma.enrollment.deleteMany({ where: { userId: studentId, courseId } });
  }

  async removeStudent(studentId: string) {
    await this.assertStudentExists(studentId);
    return this.prisma.user.delete({ where: { id: studentId } });
  }

  private async assertStudentExists(studentId: string) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== 'STUDENT') {
      throw new NotFoundException('Aluno não encontrado');
    }
    return student;
  }
}
