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

  async seedDefaults() {
    const defaults = [
      { name: 'ChatGPT', url: 'https://chat.openai.com', category: 'Inteligência Artificial', description: 'Assistente de IA para textos, ideias e conteúdo.', imageUrl: 'https://logo.clearbit.com/openai.com' },
      { name: 'Google Gemini', url: 'https://gemini.google.com', category: 'Inteligência Artificial', description: 'IA da Google para pesquisa e criação de conteúdo.', imageUrl: 'https://logo.clearbit.com/google.com' },
      { name: 'Canva', url: 'https://www.canva.com', category: 'Design', description: 'Crie artes, posts e apresentações profissionais de graça.', imageUrl: 'https://logo.clearbit.com/canva.com' },
      { name: 'CapCut', url: 'https://www.capcut.com', category: 'Design', description: 'Edição de vídeo simples para redes sociais.', imageUrl: 'https://logo.clearbit.com/capcut.com' },
      { name: 'Google Analytics', url: 'https://analytics.google.com', category: 'Análise', description: 'Monitorize o tráfego e o comportamento no seu site.', imageUrl: 'https://logo.clearbit.com/google.com' },
      { name: 'Google Trends', url: 'https://trends.google.com', category: 'Análise', description: 'Veja tendências de pesquisa e temas em alta.', imageUrl: 'https://logo.clearbit.com/google.com' },
      { name: 'Meta Business Suite', url: 'https://business.facebook.com', category: 'Redes Sociais', description: 'Gerir páginas e anúncios do Facebook e Instagram.', imageUrl: 'https://logo.clearbit.com/meta.com' },
      { name: 'Google Ads', url: 'https://ads.google.com', category: 'Redes Sociais', description: 'Criação e gestão de campanhas publicitárias no Google.', imageUrl: 'https://logo.clearbit.com/google.com' },
      { name: 'Trello', url: 'https://trello.com', category: 'Gestão de Projetos', description: 'Organize tarefas e projetos em quadros simples.', imageUrl: 'https://logo.clearbit.com/trello.com' },
      { name: 'Notion', url: 'https://www.notion.so', category: 'Gestão de Projetos', description: 'Notas, documentos e organização de equipa.', imageUrl: 'https://logo.clearbit.com/notion.so' },
      { name: 'Mailchimp', url: 'https://mailchimp.com', category: 'Email Marketing', description: 'Envio de newsletters e automação de emails.', imageUrl: 'https://logo.clearbit.com/mailchimp.com' },
      { name: 'Linktree', url: 'https://linktr.ee', category: 'Redes Sociais', description: 'Página de links única para bio das redes sociais.', imageUrl: 'https://logo.clearbit.com/linktr.ee' },
    ];

    const existing = await this.prisma.tool.findMany({ select: { name: true } });
    const existingNames = new Set(existing.map((t) => t.name));
    const toCreate = defaults
      .filter((t) => !existingNames.has(t.name))
      .map((t, i) => ({ ...t, order: i }));

    if (toCreate.length) {
      await this.prisma.tool.createMany({ data: toCreate });
    }
    return { added: toCreate.length };
  }

  private async assertExists(id: string) {
    const tool = await this.prisma.tool.findUnique({ where: { id } });
    if (!tool) throw new NotFoundException('Ferramenta não encontrada');
    return tool;
  }
}
