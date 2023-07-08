import { Module } from '@nestjs/common';
import { StreamingPlatformController } from './platform.controller';
import { StreamingPlatformService } from './platform.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StreamingPlatformController],
  providers: [StreamingPlatformService],
})
export class StreamingPlatformModule {}
