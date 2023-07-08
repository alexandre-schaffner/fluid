import { Controller, Get, UseGuards } from '@nestjs/common';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';

import { StreamingPlatformService } from './platform.service';
import { FastifyRequest } from 'fastify';
import { Req } from '@nestjs/common';

@Controller('platform')
export class StreamingPlatformController {
  constructor(
    private readonly streamingPlatformService: StreamingPlatformService,
  ) {}

  @UseGuards(VerifyJwtGuard)
  @Get()
  getStreamingPlatform() {
    return 'streaming-platform';
  }

  @UseGuards(VerifyJwtGuard)
  @Get('playlists')
  getPlaylists(@Req() req: FastifyRequest) {
    const playlists = this.streamingPlatformService.getPlaylists(req.user!.sub);
    return { playlists };
  }

  @UseGuards(VerifyJwtGuard)
  @Get('sync-playlist')
  getSyncPlaylist() {
    return 'sync-playlists';
  }
}
