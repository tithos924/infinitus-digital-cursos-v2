import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(instructorId: string, dto: CreateCourseDto) {
    const baseSlug = slugify(dto.title);
    let slug = baseSlug;
    let i = 1;
    while (await this.prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        coverImageUrl: dto.coverImageUrl,
        price: dto.price ?? 0,
        slug,
        instructorId,
      },
    });
  }

  async findAllForInstructor(instructorId: string) {
    return this.prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: { select: { enrollments: true, modules: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    return this.prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: { _count: { select: { enrollments: true } }, instructor: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: { include: { lessons: true }, orderBy: { order: 'asc' } },
        instructor: { select: { id: true, name: true } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw new NotFoundException('Curso não encontrado');
    return course;
  }

  async update(id: string, instructorId: string, dto: UpdateCourseDto) {
    await this.assertOwnership(id, instructorId);
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async remove(id: string, instructorId: string) {
    await this.assertOwnership(id, instructorId);
    return this.prisma.course.delete({ where: { id } });
  }

  async getDashboardStats(instructorId: string) {
    const [coursesPublished, students, sales] = await Promise.all([
      this.prisma.course.count({ where: { instructorId, status: 'PUBLISHED' } }),
      this.prisma.enrollment.count({ where: { course: { instructorId } } }),
      this.prisma.sale.findMany({ where: { course: { instructorId }, status: 'PAID' } }),
    ]);
    const revenue = sales.reduce((sum, s) => sum + Number(s.amount), 0);
    return {
      coursesPublished,
      students,
      salesCount: sales.length,
      revenue,
    };
  }

  private async assertOwnership(courseId: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso não encontrado');
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('Sem permissão para gerir este curso');
    }
    return course;
  }
}
