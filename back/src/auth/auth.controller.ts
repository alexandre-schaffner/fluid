/*
| Developed by Starton
| Filename : auth.controller.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';

import { verifyIdTokenGuard } from '../guards/verify-id-token.guard';
import { AuthService } from './auth.service';

const authorizeStreamingPlatformPage =
  'http://localhost:3000/authorize/streaming-platform';
const homePage = 'http://localhost:3000/home';
const selectPlaylistPage = 'http://localhost:3000/playlist';
const authorizeYouTubePage = 'http://localhost:3000/authorize/youtube';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  // Webhook for Google Sign In
  //--------------------------------------------------------------------------
  @UseGuards(verifyIdTokenGuard)
  @Post('webhook/google-sign-in')
  async googleSignIn(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Setting up a hash for the state parmeter
    //--------------------------------------------------------------------------
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

  // Webhook for YouTube Authorization
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Get('webhook/authorize/youtube')
  async authorizeYoutube(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const hash = createHmac('sha256', process.env.JWT_SECRET!);
    const jwtHash = hash.update(req.cookies['jwt']!).digest('hex');

    if (jwtHash !== state) throw new BadRequestException();

    await this.authService.exchangeYoutubeCodeForTokens(code, req.user!.sub!);

    const youtubeRefreshToken = (
      await this.prismaService.youTubeToken.findUnique({
        where: { userId: req.user!.sub! },
        select: { refreshToken: true },
      })
    )?.refreshToken;

    const streamingPlatformRefreshToken = (
      await this.prismaService.platform.findUnique({
        where: { userId: req.user!.sub! },
        select: { refreshToken: true },
      })
    )?.refreshToken;

    if (youtubeRefreshToken && !streamingPlatformRefreshToken) {
      res.status(302).redirect(authorizeStreamingPlatformPage);
    } else if (youtubeRefreshToken && streamingPlatformRefreshToken) {
      res.status(302).redirect(selectPlaylistPage);
    }
  }

  // Webhook for Spotify Authorization
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Get('webhook/spotify/code')
  async getSpotifyCode(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    await this.authService.exchangeSpotifyCodeForTokens(code, req.user!.sub!);

    return res.status(302).redirect(selectPlaylistPage);
  }
}
