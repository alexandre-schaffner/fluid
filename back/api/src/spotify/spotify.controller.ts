/*
| Developed by Fluid
| Filename : spotify.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';

import { pagesUrls } from '../utils/pageUrls';
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
}
