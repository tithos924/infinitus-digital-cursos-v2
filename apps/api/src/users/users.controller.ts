import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: any) {
    return this.usersService.me(user.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(user.sub, dto);
  }

  @Get('me/enrollments')
  myEnrollments(@CurrentUser() user: any) {
    return this.usersService.myEnrollments(user.sub);
  }

  @Get('me/certificates')
  myCertificates(@CurrentUser() user: any) {
    return this.usersService.myCertificates(user.sub);
  }
}
