import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { GrantAccessDto } from './dto/grant-access.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/students')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  list() {
    return this.adminService.listStudents();
  }

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.adminService.createStudent(dto);
  }

  @Post(':id/access')
  grantAccess(@Param('id') id: string, @Body() dto: GrantAccessDto) {
    return this.adminService.grantAccess(id, dto.courseId);
  }

  @Delete(':id/access/:courseId')
  revokeAccess(@Param('id') id: string, @Param('courseId') courseId: string) {
    return this.adminService.revokeAccess(id, courseId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.removeStudent(id);
  }
}
