import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [YoutubeService],
  controllers: [YoutubeController],
  exports: [YoutubeService],
})
export class YoutubeModule {}
