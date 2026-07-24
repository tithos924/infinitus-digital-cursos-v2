import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
