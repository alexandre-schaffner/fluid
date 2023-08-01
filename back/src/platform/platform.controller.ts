/*
| Developed by Fluid
| Filename : platform.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { SetPlaylistDto } from 'src/spotify/dto/setPlaylist.dto';

import { StreamingPlatformService } from './platform.service';

/*
|--------------------------------------------------------------------------
| Controller responsible for calling streaming platform services
|--------------------------------------------------------------------------
*/

@Controller('platform')
export class StreamingPlatformController {
  constructor(
    private readonly streamingPlatformService: StreamingPlatformService,
  ) {}

  // Get all playlists of the user on the streaming platform
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Get('playlists')
  async getPlaylists(@Req() req: FastifyRequest) {
    const playlists = await this.streamingPlatformService.getPlaylists(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      req.user!.sub,
    );
    return { playlists };
  }

  // Set the playlist of the user to sync
  //--------------------------------------------------------------------------
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
}
