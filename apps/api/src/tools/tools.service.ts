import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tool.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
  }

  async create(dto: CreateToolDto) {
    return this.prisma.tool.create({ data: dto });
  }

  async update(id: string, dto: UpdateToolDto) {
    await this.assertExists(id);
    return this.prisma.tool.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.assertExists(id);
    return this.prisma.tool.delete({ where: { id } });
  }

  private async assertExists(id: string) {
    const tool = await this.prisma.tool.findUnique({ where: { id } });
    if (!tool) throw new NotFoundException('Ferramenta não encontrada');
    return tool;
  }
}
