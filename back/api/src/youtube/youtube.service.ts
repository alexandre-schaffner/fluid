/*
| Developed by Fluid
| Filename : youtube.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { MissingDataError } from 'src/Errors/MissingData.error';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class YoutubeService {
  private readonly googleAuthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  constructor(private readonly prismaService: PrismaService) {}

  // Exchange YouTube authorization code for tokens and store them in the DB
  //--------------------------------------------------------------------------
  async exchangeCodeForTokens(code: string, userId: string) {
    try {
      const { tokens } = await this.googleAuthClient.getToken(code);

      if (!tokens.refresh_token) throw new MissingDataError('refresh_token');

      await this.prismaService.youtube.create({
        data: {
          refreshToken: tokens.refresh_token,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return tokens;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  }
}
