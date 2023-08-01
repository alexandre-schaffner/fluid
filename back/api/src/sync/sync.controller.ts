import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { VerifyJwtGuard } from '../guards/verify-jwt.guard';
import { SyncService } from './sync.service';
import { SyncStatusDto } from './dto/SyncStatus.dto';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @UseGuards(VerifyJwtGuard)
  @Post('status')
  async enableSync(@Req() req: FastifyRequest, @Body() body: SyncStatusDto) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (body.sync) await this.syncService.enableSync(req.user!.sub);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    else await this.syncService.disableSync(req.user!.sub);
  }
}
