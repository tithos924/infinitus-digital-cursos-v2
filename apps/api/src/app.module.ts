import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { ToolsModule } from './tools/tools.module';
import { BannersModule } from './banners/banners.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    AdminModule,
    MailModule,
    ToolsModule,
    BannersModule,
    ChatModule,
  ],
})
export class AppModule {}
