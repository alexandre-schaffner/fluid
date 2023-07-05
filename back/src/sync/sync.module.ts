import { Module, OnModuleInit } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule implements OnModuleInit {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly syncService: SyncService,
  ) {}
  async onModuleInit() {
    // Get all the synced users
    //--------------------------------------------------------------------------
    const syncedUsers = await this.prismaService.token.findMany({
      where: { sync: true },
    });

    // Init the syncMap with the synced users
    //--------------------------------------------------------------------------
    this.syncService.initSync(syncedUsers);
    this.syncService.sync();
  }
}
