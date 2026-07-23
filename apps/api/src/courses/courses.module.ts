import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
