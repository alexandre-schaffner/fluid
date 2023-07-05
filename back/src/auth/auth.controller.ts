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
import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthJwt } from 'src/contracts/AuthJwt';
import { GoogleJwt } from 'src/contracts/GoogleJwt';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

import { verifyIdTokenGuard } from '../guards/verify-id-token.guard';
import { AuthService } from './auth.service';

declare module 'fastify' {
  interface FastifyRequest {
    googleJwt?: GoogleJwt;
    user?: AuthJwt;
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @UseGuards(verifyIdTokenGuard)
  @Post('webhook/google-sign-in')
  async googleSignIn(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const hash = createHmac('sha256', process.env.JWT_SECRET!);

    const { googleJwt } = req;
    if (!googleJwt) return res.status(400).send('Bad Request');

    const user = await this.authService.googleSignIn(googleJwt);

    const jwt = {
      jti: uuid(),
      sub: user.id,
      expiresIn: '15min',
      tokenType: 'access_token',
    };
    const signedJwt = await this.jwtService.signAsync(jwt);
    const signedJwtHash = hash.update(signedJwt).digest('hex');

    res.setCookie('jwt', await this.jwtService.signAsync(jwt));

    const youtubeRefreshToken = (
      await this.prismaService.token.findUnique({
        where: { userId: user.id },
      })
    )?.youtubeRefreshToken;

    const streamingPlatformRefreshToken = (
      await this.prismaService.token.findUnique({
        where: { userId: user.id },
      })
    )?.streamingPlatformRefreshToken;

    if (youtubeRefreshToken && !streamingPlatformRefreshToken) {
      return res
        .status(302)
        .redirect('http://localhost:3000/authorize/streaming-platform');
    } else if (youtubeRefreshToken && streamingPlatformRefreshToken) {
      return res.status(302).redirect('http://localhost:3000/home');
    }

    return res
      .status(302)
      .redirect(
        'http://localhost:3000/authorize/youtube?user=' +
          user.name +
          '&state=' +
          signedJwtHash,
      );
  }

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
      await this.prismaService.token.findUnique({
        where: { userId: req.user!.sub! },
      })
    )?.youtubeRefreshToken;

    const streamingPlatformRefreshToken = (
      await this.prismaService.token.findUnique({
        where: { userId: req.user!.sub! },
      })
    )?.streamingPlatformRefreshToken;

    if (youtubeRefreshToken && !streamingPlatformRefreshToken) {
      res
        .status(302)
        .redirect('http://localhost:3000/authorize/streaming-platform');
    } else if (youtubeRefreshToken && streamingPlatformRefreshToken) {
      res.status(302).redirect('http://localhost:3000/home');
    }
  }

  @UseGuards(VerifyJwtGuard)
  @Get('webhook/spotify/code')
  async getSpotifyCode(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    await this.authService.exchangeSpotifyCodeForTokens(code, req.user!.sub!);

    return res.status(302).redirect('http://localhost:3000/home');
  }
}
