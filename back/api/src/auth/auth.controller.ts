/*
| Developed by Fluid
| Filename : auth.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { pagesUrls } from '../utils/pageUrls';
import { createHmac } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaService } from 'src/prisma/prisma.service';

import { verifyIdTokenGuard } from '../guards/verify-id-token.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  // Webhook for Google Sign In
  //--------------------------------------------------------------------------
  @UseGuards(verifyIdTokenGuard)
  @Post('google-sign-in')
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
    const signedJwtHash = hash.update(jwt).digest('hex');

    // Set the JWT as an httpOnly cookie
    //--------------------------------------------------------------------------
    res.setCookie('jwt', jwt, {
      path: '/',
    });

    // Check if the user has already authorized their YouTube account
    //--------------------------------------------------------------------------
    const youtubeRefreshToken = (
      await this.prismaService.youtube.findUnique({
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
    let redirectUrl = pagesUrls.generateAuthorizeYouTubePageUrl(
      user.name,
      signedJwtHash,
    );

    if (youtubeRefreshToken && !streamingPlatformRefreshToken)
      redirectUrl = pagesUrls.authorizeStreamingPlatformPage;
    else if (youtubeRefreshToken && streamingPlatformRefreshToken)
      redirectUrl = pagesUrls.homePage;

    return res.send({ redirectUrl });
  }
}
