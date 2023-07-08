import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SyncModule } from './sync/sync.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StreamingPlatformModule } from './platform/platform.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    SyncModule,
    StreamingPlatformModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
