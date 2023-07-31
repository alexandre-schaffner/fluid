/*
| Developed by Fluid
| Filename : youtube.controller.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { pagesUrls } from 'src/utils/pageUrls';

import { YoutubeService } from './youtube.service';

/*
|--------------------------------------------------------------------------
| YouTube controller
|--------------------------------------------------------------------------
*/

@Controller('youtube')
export class YoutubeController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly youtubeService: YoutubeService,
  ) {}

  // Webhook for YouTube Authorization
  //--------------------------------------------------------------------------
  @UseGuards(VerifyJwtGuard)
  @Get('webhook/authorize/')
  async authorizeYoutube(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    //--------------------------------------------------------------------------
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const hash = createHmac('sha256', process.env.JWT_SECRET!);
    //--------------------------------------------------------------------------
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const jwtHash = hash.update(req.cookies['jwt']!).digest('hex');

    console.log('jwt cookie', req.cookies['jwt'], 'hash', jwtHash);
    if (jwtHash !== state) throw new BadRequestException();
    //--------------------------------------------------------------------------
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.youtubeService.exchangeCodeForTokens(code, req.user!.sub!);

    const streamingPlatformRefreshToken = (
      await this.prismaService.platform.findUnique({
        //--------------------------------------------------------------------------
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        where: { userId: req.user!.sub! },
        select: { refreshToken: true },
      })
    )?.refreshToken;

    if (!streamingPlatformRefreshToken)
      res.status(302).redirect(pagesUrls.authorizeStreamingPlatformPage);
    else res.status(302).redirect(pagesUrls.selectPlaylistPage);
  }
}
