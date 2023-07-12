import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';

import { StreamingPlatformService } from './platform.service';
import { FastifyRequest } from 'fastify';
import { Post, Req } from '@nestjs/common';
import { SetPlaylistDto } from 'src/spotify/dto/setPlaylist.dto';

@Controller('platform')
export class StreamingPlatformController {
  constructor(
    private readonly streamingPlatformService: StreamingPlatformService,
  ) {}

  @UseGuards(VerifyJwtGuard)
  @Get('playlists')
  async getPlaylists(@Req() req: FastifyRequest) {
    const playlists = await this.streamingPlatformService.getPlaylists(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.user!.sub,
    );
    return { playlists };
  }

  @UseGuards(VerifyJwtGuard)
  @Post('playlist/set')
  async setPlaylist(@Req() req: FastifyRequest, @Body() body: SetPlaylistDto) {
    const { playlistId } = body;
    await this.streamingPlatformService.setPlaylist(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.user!.sub,
      playlistId,
    );
    return { message: 'Playlist set' };
  }

  @UseGuards(VerifyJwtGuard)
  @Post('sync')
  async syncPlaylist(@Req() req: FastifyRequest) {
    await this.streamingPlatformService.setSync(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.user!.sub,
      true,
    );
  }

  @Delete('sync')
  async unsyncPlaylist(@Req() req: FastifyRequest) {
    await this.streamingPlatformService.setSync(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.user!.sub,
      false,
    );
  }
}
