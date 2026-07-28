import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ToolsController],
  providers: [ToolsService],
})
export class ToolsModule {}
