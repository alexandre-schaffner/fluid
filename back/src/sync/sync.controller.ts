import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { VerifyJwtGuard } from '../guards/verify-jwt.guard';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @UseGuards(VerifyJwtGuard)
  @Post('on')
  async enableSync(@Req() req: FastifyRequest) {
    await this.syncService.enableSync(req.user!.sub);
  }

  @UseGuards(VerifyJwtGuard)
  @Post('off')
  async disableSync(@Req() req: FastifyRequest) {
    await this.syncService.disableSync(req.user!.sub);
  }
}
