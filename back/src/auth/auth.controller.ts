/*
| Developed by Starton
| Filename : auth.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  authorizeStreamingPlatformPage,
  authorizeYouTubePage,
  selectPlaylistPage,
} from 'constants.json';
import { createHmac } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaService } from 'src/prisma/prisma.service';
import { YoutubeService } from 'src/youtube/youtube.service';

import { verifyIdTokenGuard } from '../guards/verify-id-token.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly youtubeService: YoutubeService,
  ) {}

  // Webhook for Google Sign In
  //--------------------------------------------------------------------------
  @UseGuards(verifyIdTokenGuard)
  @Post('webhook/google-sign-in')
  async googleSignIn(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Setting up a hash for the state parmeter
    //--------------------------------------------------------------------------
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hash = createHmac('sha256', process.env.JWT_SECRET!);

    // Retrieve the Google JWT from the request
    //--------------------------------------------------------------------------
    const { googleJwt } = req;
    if (!googleJwt) return res.status(400).send('Bad Request');

    // Create or retrieve the user from the database
    //--------------------------------------------------------------------------
    const user = await this.authService.googleSignIn(googleJwt);

    // Create a JWT for the user
    //--------------------------------------------------------------------------
    const jwt = await this.authService.issueJwt(user.id);

    // The state parameter is the signed hash of the JWT
    //--------------------------------------------------------------------------
    const signedJwtHash = hash.update(JSON.stringify(jwt)).digest('hex');

    // Set the JWT as an httpOnly cookie
    //--------------------------------------------------------------------------
    res.setCookie('jwt', jwt, {
      path: '/',
    });

    // Check if the user has already authorized their YouTube account
    //--------------------------------------------------------------------------
    const youtubeRefreshToken = (
      await this.prismaService.youTubeToken.findUnique({
        where: { userId: user.id },
        select: { refreshToken: true },
      })
    )?.refreshToken;

    // Check if the user has already authorized their streaming platform account
    //--------------------------------------------------------------------------
    const streamingPlatformRefreshToken = (
      await this.prismaService.platform.findUnique({
        where: { userId: user.id },
        select: { refreshToken: true },
      })
    )?.refreshToken;

    // Redirect the user to the appropriate page
    //--------------------------------------------------------------------------
    if (youtubeRefreshToken && !streamingPlatformRefreshToken)
      return res.status(302).redirect(authorizeStreamingPlatformPage);
    else if (youtubeRefreshToken && streamingPlatformRefreshToken)
      return res.status(302).redirect(selectPlaylistPage);
    return res
      .status(302)
      .redirect(
        authorizeYouTubePage + '?user=' + user.name + '&state=' + signedJwtHash,
      );
  }
}
