import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, instructorId: string, dto: CreateModuleDto) {
    await this.assertCourseOwnership(courseId, instructorId);
    const count = await this.prisma.module.count({ where: { courseId } });
    return this.prisma.module.create({
      data: {
        title: dto.title,
        order: dto.order ?? count,
        imageUrl: dto.imageUrl,
        courseId,
      },
    });
  }

  async findAllForCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }

  async update(moduleId: string, instructorId: string, dto: UpdateModuleDto) {
    const module = await this.findWithCourse(moduleId);
    if (module.course.instructorId !== instructorId) {
      throw new ForbiddenException('Sem permissão para editar este módulo');
    }
    return this.prisma.module.update({ where: { id: moduleId }, data: dto });
  }

  async remove(moduleId: string, instructorId: string) {
    const module = await this.findWithCourse(moduleId);
    if (module.course.instructorId !== instructorId) {
      throw new ForbiddenException('Sem permissão para remover este módulo');
    }
    return this.prisma.module.delete({ where: { id: moduleId } });
  }

  private async findWithCourse(moduleId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    return module;
  }

  private async assertCourseOwnership(courseId: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso não encontrado');
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('Sem permissão para editar este curso');
    }
    return course;
  }
}
