import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Controller()
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('lessons/:id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('modules/:moduleId/lessons')
  create(
    @Param('moduleId') moduleId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonsService.create(moduleId, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('lessons/:id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('lessons/:id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.lessonsService.remove(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('lessons/:id/attachments')
  addAttachment(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: CreateAttachmentDto,
  ) {
    return this.lessonsService.addAttachment(id, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('attachments/:id')
  removeAttachment(@Param('id') id: string, @CurrentUser() user: any) {
    return this.lessonsService.removeAttachment(id, user.sub);
  }
}
