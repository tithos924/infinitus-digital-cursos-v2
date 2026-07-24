import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
