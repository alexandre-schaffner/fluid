import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { pagesUrls } from 'src/utils/pageUrls';

import { DeezerService } from './deezer.service';

@Controller('deezer')
export class DeezerController {
  constructor(private readonly deezerService: DeezerService) {}

  @UseGuards(VerifyJwtGuard)
  @Get('webhook/authorize')
  async getDeezerCode(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query('code') code: string,
    @Query('error_reason') errorReason: string,
  ) {
    if (errorReason)
      return res.status(302).redirect(pagesUrls.authorizeStreamingPlatformPage);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.deezerService.exchangeCodeForTokens(code, req.user!.sub!);

    return res.status(302).redirect(pagesUrls.homePage);
  }
}
