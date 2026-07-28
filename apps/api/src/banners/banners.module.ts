import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
