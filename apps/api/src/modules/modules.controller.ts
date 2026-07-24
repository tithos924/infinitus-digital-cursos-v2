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
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller()
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Get('courses/:courseId/modules')
  findAllForCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findAllForCourse(courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses/:courseId/modules')
  create(
    @Param('courseId') courseId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateModuleDto,
  ) {
    return this.modulesService.create(courseId, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('modules/:id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('modules/:id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.modulesService.remove(id, user.sub);
  }
}
