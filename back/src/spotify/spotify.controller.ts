/*
| Developed by Fluid
| Filename : spotify.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import {
  Body,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';

import { pagesUrls } from '../utils/pageUrls';
import { SetPlaylistDto } from './dto/setPlaylist.dto';
import { SpotifyService } from './spotify.service';

/*
|--------------------------------------------------------------------------
| Spotify controller
|--------------------------------------------------------------------------
*/

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  // Webhook for Spotify Authorization
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Get('webhook/authorize')
  async getSpotifyCode(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    //--------------------------------------------------------------------------
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.spotifyService.exchangeCodeForTokens(code, req.user!.sub!);

    return res.status(302).redirect(pagesUrls.homePage);
  }

  // Set the playlist to sync
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Get('playlist/set')
  async setPlaylist(@Req() req: FastifyRequest, @Body() body: SetPlaylistDto) {
    const { playlistId } = body;
    await this.spotifyService.setPlaylist(req.user!.sub!, playlistId);
  }
}
