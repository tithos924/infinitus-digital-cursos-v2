import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(moduleId: string, instructorId: string, dto: CreateLessonDto) {
    await this.assertModuleOwnership(moduleId, instructorId);
    const count = await this.prisma.lesson.count({ where: { moduleId } });
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        videoUrl: dto.videoUrl,
        imageUrl: dto.imageUrl,
        contentHtml: dto.contentHtml,
        order: dto.order ?? count,
        moduleId,
      },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { attachments: true, module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    return lesson;
  }

  async update(id: string, instructorId: string, dto: UpdateLessonDto) {
    await this.assertLessonOwnership(id, instructorId);
    return this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async remove(id: string, instructorId: string) {
    await this.assertLessonOwnership(id, instructorId);
    return this.prisma.lesson.delete({ where: { id } });
  }

  async addAttachment(lessonId: string, instructorId: string, dto: CreateAttachmentDto) {
    await this.assertLessonOwnership(lessonId, instructorId);
    return this.prisma.attachment.create({
      data: { name: dto.name, fileUrl: dto.fileUrl, lessonId },
    });
  }

  async removeAttachment(attachmentId: string, instructorId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: { lesson: { include: { module: { include: { course: true } } } } },
    });
    if (!attachment) throw new NotFoundException('Anexo não encontrado');
    if (attachment.lesson.module.course.instructorId !== instructorId) {
      throw new ForbiddenException('Sem permissão');
    }
    return this.prisma.attachment.delete({ where: { id: attachmentId } });
  }

  private async assertModuleOwnership(moduleId: string, instructorId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    if (module.course.instructorId !== instructorId) {
      throw new ForbiddenException('Sem permissão para editar este módulo');
    }
    return module;
  }

  private async assertLessonOwnership(lessonId: string, instructorId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    if (lesson.module.course.instructorId !== instructorId) {
      throw new ForbiddenException('Sem permissão para editar esta aula');
    }
    return lesson;
  }
}
