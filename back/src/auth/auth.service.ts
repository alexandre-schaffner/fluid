/*
| Developed by Starton
| Filename : auth.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { GoogleJwt } from 'src/contracts/GoogleJwt';
import { MissingDataError } from 'src/Errors/MissingData.error';
import { PrismaService } from 'src/prisma/prisma.service';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION AND AUTHORIZATION SERVICE
|--------------------------------------------------------------------------
*/

@Injectable()
export class AuthService {
  private readonly encodedCredentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64');

  private readonly googleAuthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  constructor(private readonly prismaService: PrismaService) {}

  // Sign-up / sign-in with Google
  //--------------------------------------------------------------------------
  async googleSignIn(credential: GoogleJwt) {
    if (!credential.email || !credential.given_name)
      throw new MissingDataError();

    return await this.prismaService.user.upsert({
      create: {
        email: credential.email,
        name: credential.given_name,
      },
      update: {},
      where: {
        email: credential.email,
      },
    });
  }

  // Exchange YouTube authorization code for tokens and store them in the DB
  //--------------------------------------------------------------------------
  async exchangeYoutubeCodeForTokens(code: string, userId: string) {
    try {
      const { tokens } = await this.googleAuthClient.getToken(code);

      if (!tokens.refresh_token) throw new MissingDataError('refresh_token');
      await this.prismaService.token.create({
        data: {
          youtubeRefreshToken: tokens.refresh_token,
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

  async exchangeSpotifyCodeForTokens(code: string, userId: string) {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=authorization_code&code=' +
        code +
        '&redirect_uri=http://localhost:8000/auth/webhook/spotify/code',
      {
        headers: {
          Authorization: 'Basic ' + this.encodedCredentials,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    await this.prismaService.token.update({
      data: {
        streamingPlatformRefreshToken: response.data.refresh_token,
      },
      where: {
        userId,
      },
    });
    return response.data;
  }
  catch(err: unknown) {
    console.error(err);
    throw err;
  }
}
